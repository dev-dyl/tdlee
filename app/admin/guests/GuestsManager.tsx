"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  isChild: boolean;
  expectedGlutenFree: boolean;
};

export default function GuestsManager() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [guests, setGuests] = React.useState<Guest[]>([]);
  const [query, setQuery] = React.useState("");

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [isChild, setIsChild] = React.useState(false);
  const [expectedGF, setExpectedGF] = React.useState(false);

  const [parent, setParent] = React.useState<Guest | null>(null);
  const [childrenSet, setChildrenSet] = React.useState<Set<string>>(new Set());
  const [childFilter, setChildFilter] = React.useState("");

  const loadGuests = async (q = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/guests${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      const data = await res.json();
      setGuests(data.guests || []);
    } catch {
      setError("Failed to load guests");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadGuests();
  }, []);

  const onCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          isChild,
          expectedGlutenFree: expectedGF,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error("Create failed");
      setFirstName("");
      setLastName("");
      setIsChild(false);
      setExpectedGF(false);
      await loadGuests(query);
    } catch {
      setError("Failed to create guest");
    } finally {
      setLoading(false);
    }
  };

  const selectParent = async (g: Guest) => {
    setParent(g);
    setChildrenSet(new Set()); // reset while loading
    setChildFilter("");
    try {
      const res = await fetch(`/api/can-rsvp-for/${g.id}`);
      const data = await res.json();
      if (!data.ok) throw new Error();
      setChildrenSet(new Set<string>(data.children || []));
    } catch {
      setError("Failed to load permissions for that parent");
    }
  };

  const toggleChild = (childId: string, checked: boolean) => {
    setChildrenSet((prev) => {
      const next = new Set(prev);
      if (checked) next.add(childId);
      else next.delete(childId);
      return next;
    });
  };

  const savePermissions = async () => {
    if (!parent) return;
    setLoading(true);
    setError(null);
    try {
      // Always ensure self-loop on save
      const children = Array.from(new Set([parent.id, ...childrenSet]));
      const res = await fetch(`/api/can-rsvp-for/${parent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ children }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error();
    } catch {
      setError("Failed to save permissions");
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = (childFilter ? guests.filter(g => {
    const full = `${g.firstName} ${g.lastName}`.toLowerCase();
    return full.includes(childFilter.toLowerCase());
  }) : guests);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Left: Create Guest */}
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Add Guest</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreateGuest} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first">First name</Label>
                <Input id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last">Last name</Label>
                <Input id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="is-child" checked={isChild} onCheckedChange={(v) => setIsChild(!!v)} />
                <Label htmlFor="is-child">Child</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="expected-gf"
                  checked={expectedGF}
                  onCheckedChange={(v) => setExpectedGF(!!v)}
                />
                <Label htmlFor="expected-gf">Expected gluten-free</Label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>Add Guest</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFirstName("");
                  setLastName("");
                  setIsChild(false);
                  setExpectedGF(false);
                }}
              >
                Reset
              </Button>
            </div>
          </form>

          <Separator className="my-6" />

          <div className="space-y-3">
            <Label htmlFor="search">Search guests</Label>
            <div className="flex items-center gap-2">
              <Input
                id="search"
                placeholder="e.g., Taylor Reed"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => loadGuests(query)}
                disabled={loading}
              >
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setQuery(""); loadGuests(""); }}
              >
                Clear
              </Button>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      {/* Right: Directory + Permissions */}
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Assign RSVP Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Guests directory */}
            <div className="rounded-xl border border-gray-200/70 p-3">
              <p className="mb-2 text-sm text-gray-700">Select a parent (actor):</p>
              <div className="max-h-[360px] overflow-auto">
                <ul className="space-y-1">
                  {guests.map((g) => (
                    <li key={g.id}>
                      <button
                        type="button"
                        onClick={() => selectParent(g)}
                        className={cn(
                          "w-full rounded-md border px-3 py-2 text-left text-sm transition hover:bg-white",
                          parent?.id === g.id ? "border-pink-500 ring-1 ring-pink-500" : "border-gray-200"
                        )}
                      >
                        <span className="font-medium text-gray-900">
                          {g.firstName} {g.lastName}
                        </span>
                        {g.isChild && <span className="ml-2 text-xs text-gray-600">(child)</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Child selection */}
            <div className="rounded-xl border border-gray-200/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray-700">
                  {parent ? (
                    <>
                      Can RSVP for:{" "}
                      <span className="font-medium text-gray-900">
                        {parent.firstName} {parent.lastName}
                      </span>
                    </>
                  ) : (
                    "Pick a parent on the left"
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Filter list..."
                    value={childFilter}
                    onChange={(e) => setChildFilter(e.target.value)}
                    className="h-8 w-40"
                  />
                </div>
              </div>

              <div className="mt-2 max-h-[320px] overflow-auto">
                {!parent ? (
                  <p className="text-sm text-gray-600">No parent selected.</p>
                ) : (
                  <ul className="space-y-2">
                    {filteredGuests.map((g) => {
                      const checked = childrenSet.has(g.id) || g.id === parent.id;
                      const isSelf = g.id === parent.id;
                      return (
                        <li key={g.id} className="flex items-center gap-3">
                          <Checkbox
                            id={`child-${g.id}`}
                            checked={checked}
                            disabled={isSelf} // self-loop enforced and locked
                            onCheckedChange={(v) => toggleChild(g.id, !!v)}
                          />
                          <Label htmlFor={`child-${g.id}`} className="text-sm">
                            {g.firstName} {g.lastName}
                            {g.isChild && <span className="ml-2 text-xs text-gray-600">(child)</span>}
                            {isSelf && <span className="ml-2 text-xs text-gray-500">• self</span>}
                          </Label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  disabled={!parent || loading}
                  onClick={savePermissions}
                >
                  Save Permissions
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => parent && selectParent(parent)}
                  disabled={!parent || loading}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              Tip: self-permission is automatic and locked.
            </p>
            <Button variant="secondary" onClick={() => loadGuests(query)} disabled={loading}>
              Reload Guests
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
