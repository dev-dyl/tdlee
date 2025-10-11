// app/about/page.tsx
import Image from "next/image";

type EventItem = {
  iso: string;     // sortable YYYY-MM-DD
  date: string;    // human label
  title: string;
  body?: string;
  img?: string;
  tag?: "dylan-bday" | "taylor-bday" | "milestone";
};

// ---------------------------
// Your core story events + notes
// (month-only dates use day=01; keep labels as you prefer)
// ---------------------------
const baseEvents: EventItem[] = [
  // ----- Your requested dated events -----
  // 2018
  {
    iso: "2018-10-31",
    date: "10/31/2018",
    title: "Dave & Buster's - Halloween",
    body: "Unicorn Ring Toss, games, and spooky vibes.",
  },
  {
    iso: "2018-11-03",
    date: "~ 11/03/2018",
    title: "First Date",
    body: "Zombieland • Peppermint Bark Chocolates • BT Speaker",
  },
  {
    iso: "2018-11-14",
    date: "11/14/2018",
    title: "Officially Dating",
    body: "Hippocampus • ASU",
  },
  {
    iso: "2018-12-01",
    date: "Dec 2018",
    title: "Christmas",
    body: "Flew to Iowa for the holidays.",
  },

  // 2019
  {
    iso: "2019-05-01",
    date: "May 2019",
    title: "Disney College Program",
    body: "We did long distance and made it work.",
  },

  // 2020
  {
    iso: "2020-03-01",
    date: "March 2020",
    title: "Big Changes",
    body: "Job changes • Ezra • Covid",
  },

  // 2021
  {
    iso: "2021-05-01",
    date: "May 2021",
    title: "Disney World #1",
    body: "First apartment together • Trivia / Taco Mich",
  },
  {
    iso: "2021-11-01",
    date: "Nov 2021",
    title: "Fall Adventures",
    body: "Guild Vegas • Zion • Crochet era begins",
  },

  // 2022
  {
    iso: "2022-01-01",
    date: "Jan 2022",
    title: "New Place, New Start",
    body: "Break-in scare • Moved into our 2nd apartment",
  },

  // 2023
  {
    iso: "2023-01-01",
    date: "New Year's 2023",
    title: "Disneyland #2",
    body: "Rang in the new year with churros and fireworks.",
  },
  {
    iso: "2023-03-01",
    date: "March 2023",
    title: "Leveling Up",
    body: "Moved in with Taylor's parents • Taylor finished her degree • We started saving for marriage",
  },
  {
    iso: "2023-09-01",
    date: "Sep 2023",
    title: "Our 3rd Apartment",
    body: "New routines, new neighborhood, same us.",
  },
  {
    iso: "2023-11-01",
    date: "Nov 2023",
    title: "San Diego + Gus Dapperton + Proposal",
    body: "He asked. She said yes. 💍",
  },

  // 2024
  {
    iso: "2024-12-01",
    date: "Dec 2024",
    title: "Adulting",
    body: "More growth, more planning, more love.",
  },

  // 2025
  {
    iso: "2025-11-14",
    date: "Nov 2025",
    title: "Wedding",
    body: "We can't wait to celebrate with you.",
  },
];

// ---------------------------
// Recurring birthdays → events (every year in range)
// Jan 26: Dylan turned y%100 + 2
// May 27: Taylor turned y%100 + 1
// ---------------------------
const minYear = Math.min(...baseEvents.map((e) => parseInt(e.iso.slice(0, 4), 10)));
const maxYear = Math.max(...baseEvents.map((e) => parseInt(e.iso.slice(0, 4), 10)));

function birthdayEvents(fromYear: number, toYear: number): EventItem[] {
  const out: EventItem[] = [];
  for (let y = fromYear; y <= toYear; y++) {
    const yy = y % 100;
    const dylanAge = yy + 2;
    const taylorAge = yy + 1;
    out.push({
      iso: `${y}-01-26`,
      date: `Jan 26, ${y}`,
      title: "Dylan's Birthday 🎂",
      body: `Dylan turned ${dylanAge}.`,
      tag: "dylan-bday",
    });
    out.push({
      iso: `${y}-05-27`,
      date: `May 27, ${y}`,
      title: "Taylor's Birthday 🎂",
      body: `Taylor turned ${taylorAge}.`,
      tag: "taylor-bday",
    });
  }
  return out;
}
const birthdays = birthdayEvents(minYear, maxYear);
const timeline: EventItem[] = [...baseEvents, ...birthdays].sort((a, b) =>
  a.iso.localeCompare(b.iso)
);

function Badge({ item }: { item: EventItem }) {
  if (item.tag === "dylan-bday")
    return (
      <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700">
        Birthday
      </span>
    );
  if (item.tag === "taylor-bday")
    return (
      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
        Birthday
      </span>
    );
  if (item.tag === "milestone")
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
        Milestone
      </span>
    );
  return null;
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-[min(1100px,92%)] py-12">
      <header className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-semibold text-gray-900">Our Story</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-700">
          A few highlights from the last few years that got us here.
        </p>
      </header>

      {/* MOBILE: vertical timeline (unchanged style) */}
      <div className="md:hidden">
        <div className="space-y-8">
          {timeline.map((e, i) => (
            <article
              key={`v-${i}`}
              className="rounded-2xl border border-gray-200 bg-white/80 p-5 backdrop-blur"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium text-pink-700">{e.date}</div>
                <Badge item={e} />
              </div>
              <h2 className="font-serif text-2xl text-gray-900">{e.title}</h2>
              {e.body && <p className="mt-2 text-gray-700">{e.body}</p>}
              {e.img && (
                <div className="mt-4 overflow-hidden rounded-xl">
                  <Image
                    src={e.img}
                    alt=""
                    width={1200}
                    height={800}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* DESKTOP: horizontal scroll with snap */}
      <div className="relative hidden md:block">
        <div
          className="
            overflow-x-auto
            scroll-smooth
            py-4
          "
        >
          {/* rail (decorative line) */}
          <div className="pointer-events-none absolute left-0 right-0 top-[118px] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <ol
            className="
              flex items-stretch gap-6
              px-2
              snap-x snap-mandatory
            "
          >
            {timeline.map((e, i) => (
              <li
                key={`h-${i}`}
                className="
                  snap-start
                  shrink-0
                  w-[min(520px,60vw)]
                "
              >
                <article className="relative rounded-2xl border border-gray-200 bg-white/80 p-5 backdrop-blur">
                  {/* Date + badge row */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-medium text-pink-700">{e.date}</div>
                    <Badge item={e} />
                  </div>

                  <h2 className="font-serif text-2xl text-gray-900">{e.title}</h2>
                  {e.body && <p className="mt-2 text-gray-700">{e.body}</p>}
                  {e.img && (
                    <div className="mt-4 overflow-hidden rounded-xl">
                      <Image
                        src={e.img}
                        alt=""
                        width={1200}
                        height={800}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}