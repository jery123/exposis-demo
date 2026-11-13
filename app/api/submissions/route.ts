import { NextResponse } from "next/server";

const laravelUrl = (
  process.env.LARAVEL_API_URL ??
  process.env.LARAVEL_APP_URL ??
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid JSON request body." }, { status: 400 });
    }
    throw error;
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  try {
    const response = await fetch(`${laravelUrl}/api/public/submissions`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store"
    });
    const payload: unknown = await response.json();
    return NextResponse.json(payload, { status: response.status });
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
