// app/api/can-rsvp-for/[parentId]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET: return the set of child IDs this parent can RSVP for (including self)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ parentId: string }> }
) {
  try {
    const { parentId } = await params;

    const rows = await sql`
      select child
      from can_rsvp_for
      where parent = ${parentId}::uuid
    `;

    // Always include self
    const children = Array.from(new Set<string>([parentId, ...rows.map(r => r.child)]));

    return NextResponse.json({ ok: true, parentId, children });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// PUT: replace the set of children this parent can RSVP for
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ parentId: string }> }
) {
  try {
    const { parentId } = await params;
    const body = (await req.json()) as { children?: string[] };
    const requested = Array.from(new Set(body.children || []));

    // Validate parent exists
    const parent = await sql`select 1 from guests where id = ${parentId}::uuid limit 1`;
    if (parent.length === 0) {
      return NextResponse.json({ ok: false, error: "Parent not found" }, { status: 404 });
    }

    // Ensure self is always included (but we won't store self->self)
    if (!requested.includes(parentId)) requested.push(parentId);

    // Replace permissions
    await sql`delete from can_rsvp_for where parent = ${parentId}::uuid`;

    for (const childId of requested) {
      if (childId === parentId) continue; // keep self implicit
      await sql`
        insert into can_rsvp_for (parent, child)
        values (${parentId}::uuid, ${childId}::uuid)
        on conflict do nothing
      `;
    }

    return NextResponse.json({ ok: true, parentId, children: requested });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}