import { NextResponse } from "next/server";

const laravelUrl = (
  process.env.LARAVEL_API_URL ??
  process.env.LARAVEL_APP_URL ??
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let body: BodyInit;
  const headers: Record<string, string> = {
    Accept: "application/json"
  };

  if (contentType.includes("multipart/form-data")) {
    let incoming: FormData;
    try {
      incoming = await request.formData();
    } catch (error) {
      if (error instanceof TypeError) {
        return NextResponse.json({ message: "Invalid multipart request body." }, { status: 400 });
      }
      throw error;
    }

    const forwarded = new FormData();
    incoming.forEach((value, key) => {
      if (value instanceof File) {
        if (value.name) forwarded.append(key, value, value.name);
      } else {
        forwarded.append(key, value);
      }
    });
    body = forwarded;
  } else {
    let payload: unknown;
    try {
      payload = await request.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        return NextResponse.json({ message: "Invalid JSON request body." }, { status: 400 });
      }
      throw error;
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    body = JSON.stringify(payload);
    headers["Content-Type"] = "application/json";
  }

  const cookie = request.headers.get("cookie");
  if (!cookie) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const csrfCookie = cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)?.[1];
  if (!csrfCookie) {
    return NextResponse.json(
      { message: "Your session token has expired. Reload the page and try again." },
      { status: 419 }
    );
  }

  let csrfToken: string;
  try {
    csrfToken = decodeURIComponent(csrfCookie);
  } catch (error) {
    if (error instanceof URIError) {
      return NextResponse.json({ message: "Invalid session token." }, { status: 419 });
    }
    throw error;
  }

  try {
    const response = await fetch(`${laravelUrl}/communaute/projets`, {
      method: "POST",
      headers: {
        ...headers,
        Cookie: cookie,
        "X-XSRF-TOKEN": csrfToken
      },
      body,
      cache: "no-store"
    });
    const payload = await response.text();

    return new NextResponse(payload, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json"
      }
    });
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        { message: "The project submission service is unavailable." },
        { status: 503 }
      );
    }
    throw error;
  }
}
