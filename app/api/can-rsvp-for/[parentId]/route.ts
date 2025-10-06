// app/api/can-rsvp-for/[parentId]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type Row = {
  id: string;
  first_name: string;
  last_name: string;
  is_child: boolean;
  expected_gluten_free: boolean;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ parentId: string }> }
) {
  const { parentId } = await params;

  const rows = await sql`
    select g.id, g.first_name, g.last_name, g.is_child, g.expected_gluten_free
    from guests g
    where g.id = ${parentId}
    union
    select g2.id, g2.first_name, g2.last_name, g2.is_child, g2.expected_gluten_free
    from can_rsvp_for c
    join guests g2 on g2.id = c.child
    where c.parent = ${parentId}
    order by is_child desc, last_name, first_name
  `;

  return NextResponse.json({
    guests: rows.map(r => ({
      id: r.id,
      firstName: r.first_name,
      lastName: r.last_name,
      isChild: r.is_child,
      expectedGlutenFree: r.expected_gluten_free,
    })),
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ parentId: string }> }
) {
  try {
    const { parentId } = await params;
    const body = (await req.json()) as { children?: string[] };
    const requested = Array.from(new Set(body.children || []));

    const parent = await sql`select 1 from guests where id = ${parentId} limit 1`;
    if (parent.length === 0) {
      return NextResponse.json({ ok: false, error: "Parent not found" }, { status: 404 });
    }

    if (!requested.includes(parentId)) requested.push(parentId);

    await sql`delete from can_rsvp_for where parent = ${parentId}`;
    for (const childId of requested) {
      await sql`
        insert into can_rsvp_for (parent, child)
        values (${parentId}, ${childId})
        on conflict do nothing
      `;
    }

    return NextResponse.json({ ok: true, parentId, children: requested });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}