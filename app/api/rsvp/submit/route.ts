// app/api/rsvp/submit/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type GuestInput = {
  guestId: string;
  attending: boolean;
  tentative?: boolean;
  glutenFree?: boolean;
  needTransport?: boolean;
  dietaryNotes?: string;
};

type Body = {
  rsvpBy?: string;                // acting guest id (required)
  guests?: GuestInput[];          // guests to submit for (>=1)
};

export async function POST(req: Request) {
  try {
    const { rsvpBy, guests = [] } = (await req.json()) as Body;
    if (!rsvpBy || guests.length === 0) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    // Verify all guest ids exist
    const ids = guests.map(g => g.guestId);
    const exists = await sql`
      select count(*)::int as count from guests where id = any(${ids})
    `;
    if (exists[0]?.count !== ids.length) {
      return NextResponse.json({ ok: false, error: "Unknown guest id(s)" }, { status: 400 });
    }

    // Build allowed set = self + children from can_rsvp_for
    const allowed = await sql`
      select ${rsvpBy}::uuid as id
      union
      select child as id from can_rsvp_for where parent = ${rsvpBy}
    `;
    const allowedSet = new Set(allowed.map(r => r.id));

    const unauthorized = guests.filter((g) => !allowedSet.has(g.guestId));
    if (unauthorized.length > 0) {
      return NextResponse.json({ ok: false, error: "Not authorized for one or more guests" }, { status: 403 });
    }

    // Append history entries
    // (You can batch this insert if you like; doing simple loop for clarity)
    for (const g of guests) {
      await sql`
        insert into rsvp_guest
          (id, guest_id, rsvp_by, attending, tentative, gluten_free, need_transport, dietary_notes, created_at)
        values
          (gen_random_uuid(), ${g.guestId}, ${rsvpBy}, ${g.attending}, ${g.tentative ?? null},
           ${g.glutenFree ?? false}, ${g.needTransport ?? null}, ${g.dietaryNotes ?? null}, now())
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
};