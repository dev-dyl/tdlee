// app/faq/page.tsx — FAQ & Details for Taylor & Dylan
// Uses shadcn/ui components (Accordion, Card, Badge, Separator)
// TailwindCSS + a light touch of Framer Motion for tasteful animation
'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Shirt, Gift, Utensils, Wine, Car, VolumeX, Sun, Moon, Users } from "lucide-react";
import { motion } from "framer-motion";

const WEDDING = {
  title: "The Wedding of Taylor and Dylan",
  tagline: "A night under the stars",
  date: "Friday, November 14, 2025",
  time: "4:00 PM",
  city: "Peoria, AZ",
  addressLine: "7015 W. Calavar Rd, Peoria, AZ 85381",
  dress: "Cocktail Attire",
  itinerary: {
    arrival: "3:30 PM",
    ceremony: "4:00 – ~4:30 PM",
    cocktails: "~4:30 – 5:30 PM",
    dinnerReception: "5:30 PM – Evening",
    quietHours: "10:00 PM",
  },
  dinner: "Pizza (gluten‑free options available)",
  drinks: "Beer, Wine, and Mixed Drinks (provided)",
  gifting: "Not required — registry available",
  registryPath: "/registry",
  parking: "Semi‑limited (~10 cars)",
  carpool: "Contact us to coordinate",
  environment: "Outdoors, inside available; forecast high 71° / low 48°",
};

// --- Bridal Party ---
// Fill in names as needed. You can remove roles that don't apply.
const BRIDAL_PARTY: { role: string; names: string[] }[] = [
  { role: "Bride", names: ["Taylor Henry"] },
  { role: "Groom", names: ["Dylan Lee"] },
  // Example roles — replace placeholders below
  { role: "Maid of Honor", names: ["Add Name"] },
  { role: "Best Man", names: ["Add Name"] },
  { role: "Bridesmaids", names: ["Add Name", "Add Name", "Add Name"] },
  { role: "Groomsmen", names: ["Add Name", "Add Name", "Add Name"] },
];

export default function FAQPage() {
  return (
    <main className="mx-auto w-[min(1200px,92%)] py-12">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
      >
        <div className="text-center">
          <p className="text-sm tracking-wide text-gray-700">{WEDDING.date} • {WEDDING.city} • {WEDDING.time}</p>
          <h1 className="mt-2 text-4xl font-semibold text-gray-800">FAQ & Details</h1>
          <p className="mt-1 text-base text-gray-600">{WEDDING.title}</p>
          <p className="mt-1 text-sm tracking-wide text-gray-600">{WEDDING.tagline}</p>

          {/* Quick info chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="gap-1"><Clock className="h-4 w-4" /> {WEDDING.time}</Badge>
            <Badge variant="secondary" className="gap-1"><MapPin className="h-4 w-4" /> {WEDDING.city}</Badge>
            <Badge variant="secondary" className="gap-1"><Shirt className="h-4 w-4" /> {WEDDING.dress}</Badge>
          </div>
        </div>
      </motion.section>

      {/* Bridal Party */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-8 rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
      >
        <div className="mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-700" />
          <h2 className="text-2xl font-semibold text-gray-800">Bridal Party</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {BRIDAL_PARTY.map(({ role, names }) => (
            <Card key={role} className="bg-white/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-900">{role}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <ul className="list-disc pl-5">
                  {names.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">Tip: Edit the <code>BRIDAL_PARTY</code> array above to add names, or remove roles you don’t need.</p>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-8 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-sm"
      >
        <h2 className="mb-2 text-center text-2xl font-semibold text-gray-800">Frequently Asked Questions</h2>
        <p className="mb-4 text-center text-sm text-gray-600">Everything you might be wondering for the big day.</p>
        <Separator className="mb-4" />

        <Accordion type="single" collapsible className="w-full">
          {/* When & Where */}
          <AccordionItem value="when-where">
            <AccordionTrigger className="text-left text-gray-900">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> When & Where is the wedding?</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Date:</span> {WEDDING.date}</p>
                <p><span className="font-medium">Time:</span> {WEDDING.time} (ceremony start)</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> <span>{WEDDING.addressLine}</span></p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(WEDDING.addressLine)}`} className="inline-block text-pink-600 underline underline-offset-4 hover:text-pink-700">Open in Maps</a>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Dress Code */}
          <AccordionItem value="dress">
            <AccordionTrigger className="text-left text-gray-900">
              <div className="flex items-center gap-2"><Shirt className="h-4 w-4" /> What should I wear?</div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700">{WEDDING.dress}. The celebration is mostly outdoors on a backyard surface — outdoor‑friendly footwear recommended, and bring a light layer for the evening.</p>
            </AccordionContent>
          </AccordionItem>

          {/* Schedule */}
          <AccordionItem value="schedule">
            <AccordionTrigger className="text-left text-gray-900">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> What’s the schedule?</div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1 pl-5 text-gray-700">
                <li><span className="font-medium">Arrival:</span> {WEDDING.itinerary.arrival}</li>
                <li><span className="font-medium">Ceremony:</span> {WEDDING.itinerary.ceremony}</li>
                <li><span className="font-medium">Cocktail Hour:</span> {WEDDING.itinerary.cocktails}</li>
                <li><span className="font-medium">Dinner & Reception:</span> {WEDDING.itinerary.dinnerReception}</li>
                <li><span className="font-medium">Neighborhood Quiet Hours:</span> {WEDDING.itinerary.quietHours}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Food & Drinks */}
          <AccordionItem value="food-drinks">
            <AccordionTrigger className="text-left text-gray-900">
              <div className="flex items-center gap-2"><Utensils className="h-4 w-4" /> What’s for dinner? Are drinks provided?</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2"><Utensils className="h-4 w-4" /> {WEDDING.dinner}</p>
                <p className="flex items-center gap-2"><Wine className="h-4 w-4" /> {WEDDING.drinks}</p>
                <p className="text-sm text-gray-600">Please include any dietary preferences with your RSVP.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Gifts / Registry */}
          <AccordionItem value="gifts">
            <AccordionTrigger className="text-left text-gray-900">
              <div className="flex items-center gap-2"><Gift className="h-4 w-4" /> Do you have a registry?</div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700">Gifts are not required. For those who have asked, our registry can be found here: <a href="/registry" className="text-pink-600 underline underline-offset-4 hover:text-pink-700">registry</a>.</p>
            </AccordionContent>
          </AccordionItem>

          {/* Parking & Carpool */}
          <AccordionItem value="parking">
            <AccordionTrigger className="text-left text-gray-900">
              <div className="flex items-center gap-2"><Car className="h-4 w-4" /> Is there parking? Can I carpool?</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Parking:</span> {WEDDING.parking}.</p>
                <p><span className="font-medium">Carpool:</span> {WEDDING.carpool}. {/* Replace with your preferred contact method */}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Noise & Neighbors */}
          <AccordionItem value="noise">
            <AccordionTrigger className="text-left text-gray-900">
              <div className="flex items-center gap-2"><VolumeX className="h-4 w-4" /> What time do things wrap up?</div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700">To respect our neighbors, we’ll wind down by <span className="font-medium">{WEDDING.itinerary.quietHours}</span>.</p>
            </AccordionContent>
          </AccordionItem>

          {/* Weather & Environment */}
          <AccordionItem value="weather">
            <AccordionTrigger className="text-left text-gray-900">
              <div className="flex items-center gap-2"><Sun className="h-4 w-4" /> What will the environment be like?</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-gray-700">
                <p>{WEDDING.environment}</p>
                <p className="flex items-center gap-1 text-sm text-gray-600"><Sun className="h-4 w-4" /> Day • <Moon className="h-4 w-4" /> Evening</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.section>

      {/* CTA Footer */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-8 rounded-2xl border border-white/60 bg-white/80 p-6 text-center shadow-xl backdrop-blur-sm"
      >
        <p className="text-gray-700">Ready to RSVP or view the registry?</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a href="#rsvp" className="inline-block rounded-lg bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600">RSVP</a>
          <a href={WEDDING.registryPath} className="inline-block rounded-lg border border-pink-400/60 bg-white/70 px-6 py-3 font-medium text-pink-600 transition hover:bg-white">Open Registry</a>
        </div>
      </motion.section>
    </main>
  );
}
