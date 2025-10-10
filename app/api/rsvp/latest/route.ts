// app/api/rsvp/latest/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const { guestIds } = (await req.json()) as { guestIds: string[] };
  if (!Array.isArray(guestIds) || guestIds.length === 0) {
    return NextResponse.json({ latest: [] });
  }
  const rows = await sql`
    with latest as (
      select distinct on (guest_id) guest_id, attending, gluten_free, need_transport, dietary_notes, created_at
      from rsvp_guest
      where guest_id = any(${guestIds})
      order by guest_id, created_at desc
    )
    select * from latest
  `;
  return NextResponse.json({ latest: rows });
};