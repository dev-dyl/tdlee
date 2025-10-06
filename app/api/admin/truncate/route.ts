import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Hard gate so you can't nuke prod by accident
    if (process.env.ALLOW_DESTRUCTIVE !== "true") {
      return NextResponse.json(
        { ok: false, error: "Destructive ops disabled. Set ALLOW_DESTRUCTIVE=true to enable." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({} as any));
    const confirm = (body?.confirm ?? "").trim();

    // Require an explicit phrase to proceed
    if (confirm !== "ERASE ALL DATA") {
      return NextResponse.json(
        { ok: false, error: 'Confirmation phrase mismatch. Type exactly: "ERASE ALL DATA".' },
        { status: 400 }
      );
    }

    // Single atomic statement; includes all tables we created
    await sql`
      truncate table
        can_rsvp_for,
        rsvp_guest,
        messages,
        guests
      restart identity cascade
    `;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}