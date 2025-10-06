// app/api/guests/[id]/can-rsvp-for/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rsvpBy } = await params;

  // Allowed = self UNION children (self-loop may already exist)
  const rows = await sql`
    select g.id, g.first_name, g.last_name, g.is_child, g.expected_gluten_free
    from guests g
    where g.id = ${rsvpBy}
    union
    select g2.id, g2.first_name, g2.last_name, g2.is_child, g2.expected_gluten_free
    from can_rsvp_for c
    join guests g2 on g2.id = c.child
    where c.parent = ${rsvpBy}
    order by is_child desc, last_name, first_name
  `;

  return NextResponse.json({
    guests: rows.map(r => ({
      id: r.id,
      firstName: r.first_name,
      lastName: r.last_name,
      isChild: r.is_child,
      expectedGlutenFree: r.expected_gluten_free
    }))
  });
}
