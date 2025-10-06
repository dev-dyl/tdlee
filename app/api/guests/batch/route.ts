// app/api/guests/batch/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type NewGuest = {
  firstName: string;
  lastName: string;
  isChild?: boolean;
  expectedGlutenFree?: boolean;
  isParent?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { guests?: NewGuest[] };
    const guests = (body.guests ?? [])
      .map((g) => ({
        first: (g.firstName ?? "").trim(),
        last: (g.lastName ?? "").trim(),
        isChild: !!g.isChild,
        expectedGF: !!g.expectedGlutenFree,
        isParent: !!g.isParent,
      }))
      .filter((g) => g.first && g.last);

    if (guests.length === 0) {
      return NextResponse.json({ ok: false, error: "No valid guests provided" }, { status: 400 });
    }

    // Build parallel arrays for unnest()
    const firsts = guests.map((g) => g.first);
    const lasts = guests.map((g) => g.last);
    const kids = guests.map((g) => g.isChild);
    const gfs = guests.map((g) => g.expectedGF);
    const parents = guests.map((g) => g.isParent);

    // One atomic statement:
    //  - generate IDs client-side via SQL (gen_random_uuid())
    //  - insert guests
    //  - add self-loops
    //  - for each parent, add parent→child for everyone in this batch
    //  - return the created rows (in original order)
    const rows = await sql`
      with input as (
        select * from unnest(
          ${firsts}::text[],
          ${lasts}::text[],
          ${kids}::boolean[],
          ${gfs}::boolean[],
          ${parents}::boolean[]
        ) with ordinality
        as t(first_name, last_name, is_child, expected_gluten_free, is_parent, ord)
      ),
      to_insert as (
        select
          gen_random_uuid() as id,
          first_name,
          last_name,
          is_child,
          expected_gluten_free,
          is_parent,
          ord
        from input
      ),
      ins as (
        insert into guests (id, first_name, last_name, is_child, expected_gluten_free)
        select id, first_name, last_name, is_child, expected_gluten_free
        from to_insert
        returning id
      ),
      self_loops as (
        insert into can_rsvp_for (parent, child)
        select id, id from to_insert
        on conflict do nothing
      ),
      parent_grants as (
        insert into can_rsvp_for (parent, child)
        select p.id as parent, c.id as child
        from to_insert p
        cross join to_insert c
        where p.is_parent
        on conflict do nothing
      )
      select id, first_name, last_name, is_child, expected_gluten_free, is_parent
      from to_insert
      order by ord;
    `;

    return NextResponse.json({
      ok: true,
      created: rows.map((r) => ({
        id: r.id,
        firstName: r.first_name,
        lastName: r.last_name,
        isChild: r.is_child,
        expectedGlutenFree: r.expected_gluten_free,
        isParent: r.is_parent,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}