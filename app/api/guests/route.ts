// app/api/guests/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type GuestRow = {
  id: string;
  first_name: string;
  last_name: string;
  is_child: boolean;
  expected_gluten_free: boolean;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(parseInt(searchParams.get("limit") || "500", 10) || 500, 2000);

  const rows = q
    ? await sql`
        select id, first_name, last_name, is_child, expected_gluten_free
        from guests
        where (first_name || ' ' || last_name) ilike ${"%" + q + "%"}
           or last_name ilike ${"%" + q + "%"}
        order by last_name, first_name
        limit ${limit}
      `
    : await sql`
        select id, first_name, last_name, is_child, expected_gluten_free
        from guests
        order by last_name, first_name
        limit ${limit}
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      firstName?: string;
      lastName?: string;
      isChild?: boolean;
      expectedGlutenFree?: boolean;
    };
    const first = (body.firstName || "").trim();
    const last = (body.lastName || "").trim();
    if (!first || !last) {
      return NextResponse.json({ ok: false, error: "Missing first/last name" }, { status: 400 });
    }

    const rows = await sql`
      insert into guests (first_name, last_name, is_child, expected_gluten_free)
      values (${first}, ${last}, ${!!body.isChild}, ${!!body.expectedGlutenFree})
      returning id
    `;
    const id = rows[0].id;

    // Ensure self-loop permission
    await sql`
      insert into can_rsvp_for (parent, child)
      values (${id}, ${id})
      on conflict do nothing
    `;

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}