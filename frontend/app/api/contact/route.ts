// app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, locale } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // TODO: Replace this with real email/service integration
    console.log("New contact submission:", {
      name,
      email,
      message,
      locale,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Something went wrong processing your request." },
      { status: 500 }
    );
  }
}
