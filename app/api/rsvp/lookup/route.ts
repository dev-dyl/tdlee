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
    const qRaw = (name ?? "").trim().replace(/\s+/g, " ");
    if (qRaw.length < 2) return NextResponse.json({ matches: [] });

    // Build a single ILIKE pattern that requires tokens in order (with any gap)
    // e.g. "ta re" -> "%ta%re%"
    const pattern = `%${qRaw.split(" ").join("%")}%`;

    const matches = await sql`
      SELECT
        id, first_name, last_name, is_child, expected_gluten_free,
        similarity((first_name || ' ' || last_name), ${qRaw}) AS score
      FROM guests
      WHERE
        (first_name || ' ' || last_name) ILIKE ${pattern}
        OR last_name ILIKE ${"%" + qRaw + "%"}   -- helps single-token last-name searches
      ORDER BY score DESC, last_name, first_name
      LIMIT 50
    `;

    return NextResponse.json({
      matches: matches.map((m) => ({
        id: m.id,
        firstName: m.first_name,
        lastName: m.last_name,
        isChild: m.is_child,
        expectedGlutenFree: m.expected_gluten_free,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ matches: [] }, { status: 200 });
  }
}