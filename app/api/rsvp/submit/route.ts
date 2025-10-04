import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type SubmitBody = {
  partyId?: string;
  guests?: { guestId: string; attending: boolean; dietary?: string }[];
  needTransport?: boolean;
  message?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubmitBody;
    const { partyId, guests = [], needTransport = false, message = "" } = body;

    if (!partyId || guests.length === 0) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    // Ensure the party exists & that guests belong to it (basic safety)
    const valid = await sql<{ count: number }[]>`
      select count(*)::int as count
      from guests
      where party_id = ${partyId}
        and id = any(${guests.map((g) => g.guestId)})
    `;
    if (!valid[0] || valid[0].count !== guests.length) {
      return NextResponse.json({ ok: false, error: "Guests/party mismatch" }, { status: 400 });
    }

    // Upsert per-guest responses
    for (const g of guests) {
      await sql`
        insert into rsvp_guest (guest_id, attending, dietary, updated_at)
        values (${g.guestId}, ${g.attending}, ${g.dietary ?? null}, now())
        on conflict (guest_id) do update
        set attending = excluded.attending,
            dietary = excluded.dietary,
            updated_at = now()
      `;
    }

    // Upsert party-level RSVP
    await sql`
      insert into rsvp_party (party_id, need_transport, message, submitted_at)
      values (${partyId}, ${needTransport}, ${message || null}, now())
      on conflict (party_id) do update
      set need_transport = excluded.need_transport,
          message = excluded.message,
          submitted_at = now()
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
