import { NextResponse } from "next/server";

const laravelUrl = (
  process.env.LARAVEL_APP_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

type RouteContext = { params: Promise<{ action: string }> };
type AuthPayload = Record<string, unknown>;

function forwardCookies(response: NextResponse, upstream: Response) {
  for (const cookie of upstream.headers.getSetCookie()) {
    response.headers.append("Set-Cookie", cookie);
  }
}

function getCsrfToken(cookie: string | null) {
  const value = cookie?.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)?.[1];
  if (!value) return null;

  try {
    return decodeURIComponent(value);
  } catch (error) {
    if (error instanceof URIError) return null;
    throw error;
  }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { action } = await params;
  if (action !== "csrf") {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  try {
    const upstream = await fetch(`${laravelUrl}/login`, {
      headers: { Accept: "text/html" },
      cache: "no-store",
      redirect: "manual"
    });

    if (upstream.status >= 500) {
      return NextResponse.json(
        { message: "Le service de connexion est momentanément indisponible." },
        { status: 503 }
      );
    }

    const response = NextResponse.json({ ready: true });
    forwardCookies(response, upstream);
    return response;
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        { message: "Le service de connexion est momentanément indisponible." },
        { status: 503 }
      );
    }
    throw error;
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const { action } = await params;
  if (action !== "login" && action !== "register") {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
    }
    throw error;
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  const csrfToken = getCsrfToken(request.headers.get("cookie"));
  if (!csrfToken) {
    return NextResponse.json(
      { message: "Votre session a expiré. Rechargez la page puis réessayez." },
      { status: 419 }
    );
  }

  const fields = body as AuthPayload;
  const payload =
    action === "login"
      ? {
          email: fields.email,
          password: fields.password,
          remember: fields.remember === true
        }
      : {
          name: fields.name,
          organization_name: fields.organization_name,
          phone: fields.phone,
          email: fields.email,
          password: fields.password,
          password_confirmation: fields.password_confirmation
        };

  try {
    const upstream = await fetch(`${laravelUrl}/${action}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") ?? "",
        "X-XSRF-TOKEN": csrfToken
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      redirect: "manual"
    });

    if (upstream.status >= 300 && upstream.status < 400) {
      const location = upstream.headers.get("location");
      const redirectUrl = location ? new URL(location, laravelUrl) : new URL("/dashboard", laravelUrl);
      if (redirectUrl.origin !== new URL(laravelUrl).origin) {
        return NextResponse.json(
          { message: "Le service a renvoyé une destination inattendue." },
          { status: 502 }
        );
      }

      const response = NextResponse.json({
        redirectTo: `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`
      });
      forwardCookies(response, upstream);
      return response;
    }

    const contentType = upstream.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { message: "Une erreur est survenue. Veuillez réessayer." },
        { status: upstream.status >= 500 ? 503 : upstream.status }
      );
    }

    const response = new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: { "Content-Type": contentType }
    });
    forwardCookies(response, upstream);
    return response;
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        { message: "Le service de connexion est momentanément indisponible." },
        { status: 503 }
      );
    }
    throw error;
  }
}
