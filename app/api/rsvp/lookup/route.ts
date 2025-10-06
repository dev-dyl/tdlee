// app/api/rsvp/lookup/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  is_child: boolean;
  expected_gluten_free: boolean;
};

export async function POST(req: Request) {
  try {
    const { name } = (await req.json()) as { name?: string };
    const q = (name ?? "").trim();
    if (q.length < 2) return NextResponse.json({ matches: [] });

    const matches = await sql`
      select id, first_name, last_name, is_child, expected_gluten_free
      from guests
      where (first_name || ' ' || last_name) ilike ${"%" + q + "%"}
         or last_name ilike ${"%" + q + "%"}
      order by last_name, first_name
      limit 50
    `;

    return NextResponse.json({
      matches: matches.map((m) => ({
        id: m.id,
        firstName: m.first_name,
        lastName:  m.last_name,
        isChild:   m.is_child,
        expectedGlutenFree: m.expected_gluten_free
      }))
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ matches: [] }, { status: 200 });
  }
};