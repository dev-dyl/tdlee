import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type LookupBody = { name?: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LookupBody;
    const name = (body.name ?? "").trim();
    if (name.length < 2) {
      return NextResponse.json({ matches: [] }, { status: 200 });
    }

    // Simple fuzzy-ish search across full name and last name
    const rows = await sql<
      {
        party_id: string;
        household_name: string;
        guest_id: string;
        first_name: string;
        last_name: string;
      }[]
    >`
      select p.id as party_id, p.household_name,
             g.id as guest_id, g.first_name, g.last_name
      from parties p
      join guests g on g.party_id = p.id
      where (g.first_name || ' ' || g.last_name) ilike ${"%" + name + "%"}
         or g.last_name ilike ${"%" + name + "%"}
      order by p.household_name, g.last_name, g.first_name
      limit 100;
    `;

    // Group guests by party
    const map = new Map<string, { partyId: string; householdName: string; guests: any[] }>();
    for (const r of rows) {
      if (!map.has(r.party_id)) {
        map.set(r.party_id, { partyId: r.party_id, householdName: r.household_name, guests: [] });
      }
      map.get(r.party_id)!.guests.push({
        id: r.guest_id,
        firstName: r.first_name,
        lastName: r.last_name,
      });
    }

    return NextResponse.json({ matches: Array.from(map.values()) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ matches: [] }, { status: 200 });
  }
}
