// app/api/rsvp/submit/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type GuestInput = {
  guestId: string;
  attending: boolean;
  glutenFree?: boolean;
  needTransport?: boolean;
  dietaryNotes?: string;
};

type Body = {
  rsvpBy?: string;         // acting guest id (required)
  guests?: GuestInput[];   // guests to submit for (>=1)
};

export async function POST(req: Request) {
  try {
    const { rsvpBy, guests = [] } = (await req.json()) as Body;
    if (!rsvpBy || guests.length === 0) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    // Verify all guest ids exist
    const ids = guests.map((g) => g.guestId);
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
    const allowedSet = new Set(allowed.map((r) => r.id));
    const unauthorized = guests.filter((g) => !allowedSet.has(g.guestId));
    if (unauthorized.length > 0) {
      return NextResponse.json({ ok: false, error: "Not authorized for one or more guests" }, { status: 403 });
    }

    // Normalize the incoming rows to the semantics you want to store
    // - needTransport only if attending, else false
    // - dietaryNotes only if attending and non-empty, else null
    // - glutenFree coerced to boolean (defaults to false)
    const normalized = guests.map((g) => {
      const attending = !!g.attending;
      return {
        guestId: g.guestId,
        attending,
        glutenFree: !!g.glutenFree,
        needTransport: attending ? !!g.needTransport : false,
        dietaryNotes: attending
          ? (g.dietaryNotes?.trim() ? g.dietaryNotes.trim() : null)
          : null,
      };
    });

    // Batch insert with json_to_recordset for clarity + performance
    // Note: no 'tentative' column anymore.
    await sql`
      with data as (
        select *
        from jsonb_to_recordset(${JSON.stringify(normalized)}::jsonb)
          as x(
            "guestId" uuid,
            "attending" boolean,
            "glutenFree" boolean,
            "needTransport" boolean,
            "dietaryNotes" text
          )
      )
      insert into rsvp_guest
        (id, guest_id, rsvp_by, attending, gluten_free, need_transport, dietary_notes, created_at)
      select
        gen_random_uuid(),
        d."guestId",
        ${rsvpBy}::uuid,
        d."attending",
        coalesce(d."glutenFree", false),
        coalesce(d."needTransport", false),
        d."dietaryNotes",
        now()
      from data d
    `;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}