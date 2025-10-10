"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

// ------- Types
type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  isChild: boolean;
  expectedGlutenFree?: boolean;
};

type LookupMatch = Guest;

type GuestFormRow = {
  guestId: string;
  attending: "yes" | "no";           // maps to attending boolean
  glutenFree: boolean;
  needTransport: boolean;
  dietaryNotes?: string;
};

// ------- Validation
const nameSchema = z.object({ name: z.string().min(2, "Enter at least 2 characters") });

const submitSchema = z.object({
  rsvpBy: z.string().uuid(),
  guests: z.array(
    z.object({
      guestId: z.string().uuid(),
      attending: z.enum(["yes", "no"]),
      glutenFree: z.boolean().optional(),
      needTransport: z.boolean().optional(),
      dietaryNotes: z.string().max(500).optional(),
    })
  ).min(1, "No guests to respond for"),
  message: z.string().max(1000).optional(),
  sender: z.string().max(120).optional(),
  publishMessage: z.boolean().optional(),   // NEW
  anonymous: z.boolean().optional(),        // NEW
});

type SubmitValues = z.infer<typeof submitSchema>;

export default function RsvpFlow() {
  const [step, setStep] = React.useState<0 | 1 | 2>(0);
  const [loading, setLoading] = React.useState(false);
  const [errorText, setErrorText] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [matches, setMatches] = React.useState<LookupMatch[]>([]);
  const [actor, setActor] = React.useState<Guest | null>(null);
  const [allowed, setAllowed] = React.useState<Guest[]>([]);

  // Step 0: name lookup
  const nameForm = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });

  const onLookup = nameForm.handleSubmit(async ({ name }) => {
    setLoading(true);
    setErrorText(null);
    setMatches([]);
    setActor(null);
    setAllowed([]);
    try {
      const res = await fetch("/api/rsvp/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await res.json()) as { matches: LookupMatch[] };
      setMatches(data.matches || []);
      if ((data.matches?.length ?? 0) === 0) {
        setErrorText("No matches found. Try a different spelling.");
      }
    } catch {
      setErrorText("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  });

  // Steps 1–2
  const form = useForm<SubmitValues>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      rsvpBy: "",
      guests: [],
      message: "",
      sender: "",
      publishMessage: true,
      anonymous: false,
    },
  });

  // When actor is chosen, fetch allowed (self + direct children)
  React.useEffect(() => {
    const run = async () => {
      if (!actor) return;
      setLoading(true);
      setErrorText(null);
      try {
        const res = await fetch(`/api/guests/${actor.id}/can-rsvp-for`, { cache: "no-store" });
        const data = (await res.json()) as { guests: Guest[] };

        // Ensure actor is first, then others by name
        const list = (data.guests || []);
        const actorFirst = [
          ...list.filter(g => g.id === actor.id),
          ...list.filter(g => g.id !== actor.id).sort((a, b) => {
            const A = `${a.lastName} ${a.firstName}`.toLowerCase();
            const B = `${b.lastName} ${b.firstName}`.toLowerCase();
            return A.localeCompare(B);
          }),
        ];

        setAllowed(actorFirst);

        // Seed rows: default to "no" attendance;
        form.reset({
          rsvpBy: actor.id,
          guests: actorFirst.map((g) => ({
            guestId: g.id,
            attending: "no",
            glutenFree: !!g.expectedGlutenFree,
            needTransport: false,
            dietaryNotes: "",
          })),
          message: "",
          sender: `${actor.firstName} ${actor.lastName}`,
          publishMessage: true,
          anonymous: false,
        });

        setStep(1);
      } catch {
        setErrorText("Could not load invitees for this person.");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor?.id]);

  // Submit: RSVP history + optional message (with publish/anonymous)
  const onSubmitAll = form.handleSubmit(async (values) => {
    setLoading(true);
    setErrorText(null);
    setSuccess(false);

    // Map to API booleans
    const guestsPayload = (values.guests || []).map((g) => {
      const attendingBool = g.attending === "yes";
      return {
        guestId: g.guestId,
        attending: attendingBool,
        glutenFree: !!g.glutenFree,
        needTransport: attendingBool ? !!g.needTransport : false,
        dietaryNotes: attendingBool ? (g.dietaryNotes || null) : null,
      };
    });

    try {
      // 1) RSVP history append
      const res1 = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rsvpBy: values.rsvpBy, guests: guestsPayload }),
      });
      const ok1 = await res1.json();
      if (!ok1?.ok) throw new Error("RSVP failed");

      // 2) Optional message
      if (values.message && values.message.trim()) {
        const res2 = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: values.message.trim(),
            sender: values.anonymous ? "Anonymous" : (values.sender?.trim() || undefined),
            guestId: values.rsvpBy,
            publish: values.publishMessage !== false,
            anonymous: values.anonymous === true,
          }),
        });
        const ok2 = await res2.json();
        if (!ok2?.ok) throw new Error("Message send failed");
      }

      setSuccess(true);
    } catch {
      setErrorText("Could not submit your RSVP. Please try again.");
    } finally {
      setLoading(false);
    }
  });

  const StepHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="mb-4 text-center">
      <h2 className="font-serif text-2xl font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-1 text-gray-700">{subtitle}</p>}
    </div>
  );

  const Stepper = () => (
    <div className="flex items-center justify-center gap-2 pb-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn("h-2 w-8 rounded-full transition", i <= step ? "bg-pink-500" : "bg-gray-300")}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
    >
      <Stepper />

      {/* STEP 0: Name lookup */}
      {step === 0 && (
        <Card className="mx-auto w-full max-w-xl bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center">Find Yourself</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLookup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your full name</Label>
                <Input id="name" placeholder="e.g., Taylor Reed" {...nameForm.register("name")} />
                {nameForm.formState.errors.name && (
                  <p className="text-sm text-red-600">{nameForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</Button>
              </div>
              {errorText && <p className="text-sm text-red-600">{errorText}</p>}
              {matches.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <p className="text-sm text-gray-700 text-center">Select your name:</p>
                  <div className="mt-3 grid gap-2">
                    {matches.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setActor(m)}
                        className={cn(
                          "rounded-lg border px-4 py-3 text-left transition hover:bg-white",
                          actor?.id === m.id ? "border-pink-500 ring-1 ring-pink-500" : "border-gray-200"
                        )}
                      >
                        <div className="font-medium text-gray-900">
                          {m.firstName} {m.lastName}
                          {m.isChild ? <span className="ml-2 text-xs text-gray-600">(child)</span> : null}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" onClick={() => setMatches([])}>Clear</Button>
                    <Button onClick={() => actor && setStep(1)} disabled={!actor || loading}>
                      Continue
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* STEP 1: Per-guest selections */}
      {step === 1 && actor && (
        <Card className="mx-auto mt-4 w-full max-w-3xl bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center">Who are you replying for?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <p className="text-sm text-gray-700">
                Responding as{" "}
                <span className="font-medium text-gray-900">
                  {actor.firstName} {actor.lastName}
                </span>
              </p>
            </div>

            {/* Instruction block: actor first, then note */}
            <div className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
              <p className="text-sm text-gray-800">
                You’re listed first. You can RSVP for <em>everyone</em> below, or each person can complete
                their own RSVP later.
              </p>
            </div>

            {/* List */}
            <div className="space-y-4">
              {allowed.map((g, idx) => {
                const row = form.watch(`guests.${idx}` as const) as GuestFormRow | undefined;

                return (
                  <div key={g.id} className="rounded-xl border border-gray-200/70 bg-white/70 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="font-medium text-gray-900">
                        {g.firstName} {g.lastName}{" "}
                        {g.isChild ? <span className="ml-1 text-xs text-gray-600">(child)</span> : null}
                        {idx === 0 && <span className="ml-2 rounded bg-pink-50 px-2 py-0.5 text-xs text-pink-700">you</span>}
                      </div>
                      {/* Group 1: Attendance */}
                      <div className="sm:w-[300px]">
                        <Label className="mb-1 block text-xs uppercase tracking-wide text-gray-500">Attendance</Label>
                        <RadioGroup
                          className="grid grid-cols-2 gap-2"
                          value={row?.attending ?? "no"}
                          onValueChange={(v: "yes" | "no") =>
                            form.setValue(`guests.${idx}.attending` as const, v, { shouldDirty: true })
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem id={`att-yes-${g.id}`} value="yes" />
                            <Label htmlFor={`att-yes-${g.id}`}>Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem id={`att-no-${g.id}`} value="no" />
                            <Label htmlFor={`att-no-${g.id}`}>No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Group 2 */}
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">

                      {/* Options when attending */}
                      {(row?.attending ?? "no") === "yes" && (
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`transport-${g.id}`}
                              checked={!!row?.needTransport}
                              onCheckedChange={(v) =>
                                form.setValue(`guests.${idx}.needTransport` as const, !!v, { shouldDirty: true })
                              }
                            />
                            <Label htmlFor={`transport-${g.id}`}>Needs shuttle</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`gf-${g.id}`}
                              checked={!!row?.glutenFree}
                              onCheckedChange={(v) =>
                                form.setValue(`guests.${idx}.glutenFree` as const, !!v, { shouldDirty: true })
                              }
                            />
                            <Label htmlFor={`gf-${g.id}`}>Gluten-free</Label>
                          </div>
                        </div>
                      )}
                    </div>

                    {(row?.attending ?? "no") === "yes" && (
                      <div className="mt-3">
                        <Label htmlFor={`diet-${g.id}`}>Dietary notes</Label>
                        <Textarea
                          id={`diet-${g.id}`}
                          placeholder="Allergies or preferences (optional)"
                          value={row?.dietaryNotes ?? ""}
                          onChange={(e) =>
                            form.setValue(`guests.${idx}.dietaryNotes` as const, e.target.value, { shouldDirty: true })
                          }
                        />
                      </div>
                    )}

                    {/* Insert a divider + note after the first (actor) row */}
                    {idx === 0 && allowed.length > 1 && (
                      <div className="mt-4">
                        <Separator />
                        <p className="mt-2 text-xs text-gray-600">
                          You can check responses for everyone above—or each person can reply later on their own.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setStep(0);
                setActor(null);
                setAllowed([]);
                setMatches([]);
              }}
            >
              Back
            </Button>
            <Button onClick={() => setStep(2)} disabled={allowed.length === 0}>
              Continue
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: Message + Submit (+ publish/anonymous) */}
      {step === 2 && actor && (
        <Card className="mx-auto mt-4 w-full max-w-xl bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center">Leave a Message (optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="sender">From</Label>
              <Input
                id="sender"
                placeholder="Your name"
                value={form.watch("sender") ?? ""}
                onChange={(e) => form.setValue("sender", e.target.value)}
                disabled={form.watch("anonymous") === true}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Say hello to the couple (optional)"
                value={form.watch("message") ?? ""}
                onChange={(e) => form.setValue("message", e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="publish"
                  checked={form.watch("publishMessage") ?? true}
                  onCheckedChange={(v) => form.setValue("publishMessage", !!v)}
                />
                <Label htmlFor="publish">Publish this to our website</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="anon"
                  checked={form.watch("anonymous") ?? false}
                  onCheckedChange={(v) => form.setValue("anonymous", !!v)}
                />
                <Label htmlFor="anon">Make my name anonymous</Label>
              </div>
            </div>

            {errorText && <p className="text-sm text-red-600">{errorText}</p>}
            {success && <p className="text-sm text-green-700">Thanks! Your RSVP has been recorded.</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button
              onClick={() => onSubmitAll()}
              disabled={
                loading ||
                (form.watch("guests") as GuestFormRow[]).every((g) => g.attending === "no")
              }
            >
              {loading ? "Submitting..." : "Submit RSVP"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </motion.div>
  );
}