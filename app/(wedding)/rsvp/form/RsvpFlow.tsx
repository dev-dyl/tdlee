"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Guest = { id: string; firstName: string; lastName: string };
type Party = { partyId: string; householdName: string; guests: Guest[] };

const nameSchema = z.object({ name: z.string().min(2, "Enter at least 2 characters") });

const submitSchema = z.object({
  partyId: z.string().uuid(),
  guests: z.array(
    z.object({
      guestId: z.string().uuid(),
      attending: z.boolean(),
      dietary: z.string().max(500).optional(),
    })
  ).min(1, "No guests to respond for"),
  needTransport: z.boolean().optional(),
  message: z.string().max(1000).optional(),
});

type SubmitValues = z.infer<typeof submitSchema>;

export default function RsvpFlow() {
  const [step, setStep] = React.useState<0 | 1 | 2 | 3>(0);
  const [matches, setMatches] = React.useState<Party[]>([]);
  const [selectedParty, setSelectedParty] = React.useState<Party | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorText, setErrorText] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Step 1: name lookup
  const nameForm = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });

  const onLookup = nameForm.handleSubmit(async ({ name }) => {
    setLoading(true);
    setErrorText(null);
    setMatches([]);
    setSelectedParty(null);
    try {
      const res = await fetch("/api/rsvp/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await res.json()) as { matches: Party[] };
      setMatches(data.matches || []);
      if (data.matches?.length === 1) {
        setSelectedParty(data.matches[0]);
      }
      setStep(1); // advance to invitee selection
    } catch (e) {
      setErrorText("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  });

  // Step 2-4: final submission form
  const submitForm = useForm<SubmitValues>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      partyId: "",
      guests: [],
      needTransport: false,
      message: "",
    },
  });

  // When party is chosen, seed the guests list
  React.useEffect(() => {
    if (!selectedParty) return;
    submitForm.reset({
      partyId: selectedParty.partyId,
      guests: selectedParty.guests.map((g) => ({
        guestId: g.id,
        attending: false,
        dietary: "",
      })),
      needTransport: false,
      message: "",
    });
  }, [selectedParty]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmitAll = submitForm.handleSubmit(async (values) => {
    setLoading(true);
    setErrorText(null);
    try {
      const res = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!data.ok) throw new Error("Submit failed");
      setSuccess(true);
      setStep(3); // ensure we’re on the last step
    } catch (e) {
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
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-8 rounded-full transition",
            i <= step ? "bg-pink-500" : "bg-gray-300"
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      <Stepper />

      {/* STEP 0: Name lookup */}
      {step === 0 && (
        <Card className="mx-auto w-full max-w-xl bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center">Find Your Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLookup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your full name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Alex Johnson"
                  {...nameForm.register("name")}
                />
                {nameForm.formState.errors.name && (
                  <p className="text-sm text-red-600">{nameForm.formState.errors.name.message}</p>
                )}
              </div>
              {errorText && <p className="text-sm text-red-600">{errorText}</p>}
              <div className="flex items-center justify-center gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* STEP 1: Matches + invitee selection */}
      {step === 1 && (
        <Card className="mx-auto mt-4 w-full max-w-2xl bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center">Who’s In Your Party?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {matches.length === 0 && (
              <div className="text-center">
                <StepHeader
                  title="No matches found"
                  subtitle="Try a different spelling, or contact us and we’ll help locate your invitation."
                />
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                </div>
              </div>
            )}

            {matches.length > 0 && (
              <>
                {matches.length > 1 && (
                  <p className="text-center text-sm text-gray-700">
                    We found multiple invitations—choose yours.
                  </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  {matches.map((p) => (
                    <button
                      key={p.partyId}
                      type="button"
                      onClick={() => setSelectedParty(p)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition hover:bg-white",
                        selectedParty?.partyId === p.partyId
                          ? "border-pink-500 ring-1 ring-pink-500"
                          : "border-gray-200"
                      )}
                    >
                      <p className="font-medium text-gray-900">{p.householdName}</p>
                      <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">
                        {p.guests.map((g) => (
                          <li key={g.id}>{g.firstName} {g.lastName}</li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>

                {selectedParty && (
                  <>
                    <Separator className="my-4" />
                    <StepHeader title="Who will attend?" subtitle="Check everyone who is attending." />
                    <div className="space-y-3">
                      {selectedParty.guests.map((g, idx) => {
                        const field = submitForm.watch(`guests.${idx}`);
                        return (
                          <div key={g.id} className="flex items-center gap-3">
                            <Checkbox
                              id={`guest-${g.id}`}
                              checked={!!field?.attending}
                              onCheckedChange={(val) => submitForm.setValue(`guests.${idx}.attending`, !!val, { shouldDirty: true })}
                            />
                            <Label htmlFor={`guest-${g.id}`} className="font-medium">
                              {g.firstName} {g.lastName}
                            </Label>
                          </div>
                        );
                      })}
                    </div>

                    <CardFooter className="mt-6 flex justify-between">
                      <Button variant="outline" onClick={() => { setSelectedParty(null); setStep(1); }}>
                        Choose a different invitation
                      </Button>
                      <Button onClick={() => setStep(2)} disabled={!selectedParty}>
                        Continue
                      </Button>
                    </CardFooter>
                  </>
                )}

                {!selectedParty && (
                  <CardFooter className="mt-2 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                    <Button disabled>Select an invitation</Button>
                  </CardFooter>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Transport + Dietary */}
      {step === 2 && selectedParty && (
        <Card className="mx-auto mt-4 w-full max-w-2xl bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center">Transport & Dietary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="need-transport">Do you need shuttle transport?</Label>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="need-transport"
                  checked={!!submitForm.watch("needTransport")}
                  onCheckedChange={(v) => submitForm.setValue("needTransport", !!v, { shouldDirty: true })}
                />
                <span className="text-gray-700">Yes, we’ll use the shuttle</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="text-gray-800 font-medium">Dietary notes (per person)</p>
              {selectedParty.guests.map((g, idx) => {
                const attending = submitForm.watch(`guests.${idx}.attending`);
                return (
                  <div key={g.id} className="space-y-2">
                    <Label htmlFor={`diet-${g.id}`}>
                      {g.firstName} {g.lastName} {attending ? "(attending)" : "(not attending)"}
                    </Label>
                    <Textarea
                      id={`diet-${g.id}`}
                      placeholder="Allergies or preferences (optional)"
                      disabled={!attending}
                      value={submitForm.watch(`guests.${idx}.dietary`) ?? ""}
                      onChange={(e) =>
                        submitForm.setValue(`guests.${idx}.dietary`, e.target.value, { shouldDirty: true })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: Message + Submit */}
      {step === 3 && selectedParty && (
        <Card className="mx-auto mt-4 w-full max-w-xl bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center">Leave a Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Optional note for the couple"
              value={submitForm.watch("message") ?? ""}
              onChange={(e) => submitForm.setValue("message", e.target.value, { shouldDirty: true })}
            />
            {errorText && <p className="text-sm text-red-600">{errorText}</p>}
            {success && <p className="text-sm text-green-700">Thanks! Your RSVP has been recorded.</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button
              onClick={() => onSubmitAll()}
              disabled={loading || submitForm.watch("guests").every((g) => !g.attending)}
            >
              {loading ? "Submitting..." : "Submit RSVP"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
