import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { content, sender, guestId, publish, anonymous } = (await req.json()) as {
      content?: string; sender?: string | null; guestId?: string | null;
      publish?: boolean; anonymous?: boolean;
    };
    if (!content || !content.trim()) {
      return NextResponse.json({ ok: false, error: "Empty content" }, { status: 400 });
    }
    await sql`
      insert into messages (message_id, submitted_at, content, sender, publish, anonymous)
      values (gen_random_uuid(), now(), ${content.trim()}, ${sender ?? null}, ${publish ?? true}, ${anonymous ?? false})
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}