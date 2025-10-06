"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


type DBGuest = {
  id: string;
  firstName: string;
  lastName: string;
  isChild: boolean;
  expectedGlutenFree: boolean;
};

type StagedGuest = {
  tempId: string; // local-only id
  firstName: string;
  lastName: string;
  isChild: boolean;
  expectedGlutenFree: boolean;
  isParent: boolean;
};

export default function GuestsAdmin() {
  // Top-left: Add Guest (staging only)
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [isChild, setIsChild] = React.useState(false);
  const [expectedGF, setExpectedGF] = React.useState(false);

  // Top-right: Party Builder (staged list)
  const [staged, setStaged] = React.useState<StagedGuest[]>([]);
  const addToPartyBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    setStaged((prev) => [
      ...prev,
      {
        tempId: cryptoRandom(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        isChild,
        expectedGlutenFree: expectedGF,
        isParent: false,
      },
    ]);
    // reset inputs
    setFirstName("");
    setLastName("");
    setIsChild(false);
    setExpectedGF(false);
  };

  const toggleStagedParent = (id: string, v: boolean) => {
    setStaged((prev) => prev.map(g => g.tempId === id ? { ...g, isParent: v } : g));
  };
  const removeStaged = (id: string) => setStaged(prev => prev.filter(g => g.tempId !== id));
  const clearStaged = () => setStaged([]);

  const [batchLoading, setBatchLoading] = React.useState(false);
  const [batchError, setBatchError] = React.useState<string | null>(null);
  const [batchResult, setBatchResult] = React.useState<any>(null);

  const commitPartyToDB = async () => {
    if (staged.length === 0) return;
    setBatchLoading(true);
    setBatchError(null);
    setBatchResult(null);
    try {
      const res = await fetch("/api/guests/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guests: staged.map(s => ({
            firstName: s.firstName,
            lastName: s.lastName,
            isChild: s.isChild,
            expectedGlutenFree: s.expectedGlutenFree,
            isParent: s.isParent,
          })),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error("Batch failed");
      setBatchResult(data.created);
      clearStaged();
      await loadGuests(dbQuery);
      if (selectedParent) {
        // refresh currently selected parent permissions
        await selectParent(selectedParent);
      }
    } catch {
      setBatchError("Failed to commit party to DB");
    } finally {
      setBatchLoading(false);
    }
  };

  // Bottom panel: DB Directory + Permission editor
  const [dbGuests, setDbGuests] = React.useState<DBGuest[]>([]);
  const [dbQuery, setDbQuery] = React.useState("");
  const [loadingGuests, setLoadingGuests] = React.useState(false);
  const [errorGuests, setErrorGuests] = React.useState<string | null>(null);

  const loadGuests = async (q = "") => {
    setLoadingGuests(true);
    setErrorGuests(null);
    try {
      const res = await fetch(`/api/guests${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      const data = await res.json();
      setDbGuests(data.guests || []);
    } catch {
      setErrorGuests("Failed to load guests");
    } finally {
      setLoadingGuests(false);
    }
  };
  React.useEffect(() => { loadGuests(); }, []);

  // Selection + permission editing
  const [selectedParent, setSelectedParent] = React.useState<DBGuest | null>(null);
  const [childrenSet, setChildrenSet] = React.useState<Set<string>>(new Set());
  const [permError, setPermError] = React.useState<string | null>(null);
  const [permLoading, setPermLoading] = React.useState(false);
  const [childFilter, setChildFilter] = React.useState("");

  const selectParent = async (g: DBGuest) => {
    setSelectedParent(g);
    setChildrenSet(new Set());
    setPermError(null);
    try {
      const res = await fetch(`/api/can-rsvp-for/${g.id}`);
      const data = await res.json();
      if (!data.ok) throw new Error();
      setChildrenSet(new Set<string>(data.children || []));
    } catch {
      setPermError("Failed to load permissions for that guest");
    }
  };
  const toggleChild = (id: string, v: boolean) =>
    setChildrenSet(prev => {
      const next = new Set(prev);
      if (v) next.add(id);
      else next.delete(id);
      return next;
    });
  const savePermissions = async () => {
    if (!selectedParent) return;
    setPermLoading(true);
    setPermError(null);
    try {
      const children = Array.from(new Set([selectedParent.id, ...childrenSet]));
      const res = await fetch(`/api/can-rsvp-for/${selectedParent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ children }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error();
    } catch {
      setPermError("Failed to save permissions");
    } finally {
      setPermLoading(false);
    }
  };

  const filteredChildrenList = childFilter
    ? dbGuests.filter(g => (`${g.firstName} ${g.lastName}`).toLowerCase().includes(childFilter.toLowerCase()))
    : dbGuests;

  const [wipeOpen, setWipeOpen] = React.useState(false);
  const [wipeTyping, setWipeTyping] = React.useState("");
  const [wipeLoading, setWipeLoading] = React.useState(false);
  const [wipeMsg, setWipeMsg] = React.useState<string | null>(null);

  const doWipe = async () => {
    setWipeLoading(true);
    setWipeMsg(null);
    try {
      const res = await fetch("/api/admin/truncate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "ERASE ALL DATA" }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "wipe failed");

      // refresh UI
      await loadGuests("");
      setSelectedParent(null);
      setChildrenSet(new Set());
      setWipeMsg("Database wiped successfully.");
    } catch (e: any) {
      setWipeMsg(e?.message || "Failed to wipe database.");
    } finally {
      setWipeLoading(false);
    }
  };


  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Row 1: two panels */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Top-left: Add Guest (staging only) */}
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Add Guest → Party Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addToPartyBuilder} className="space-y-4">
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
                  <Checkbox id="expected-gf" checked={expectedGF} onCheckedChange={(v) => setExpectedGF(!!v)} />
                  <Label htmlFor="expected-gf">Expected gluten-free</Label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit">Add to Builder</Button>
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
                  Reset Fields
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Top-right: Party Builder */}
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Party Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {staged.length === 0 ? (
              <p className="text-sm text-gray-600">No guests staged yet. Add guests on the left.</p>
            ) : (
              <ul className="space-y-2">
                {staged.map((g) => (
                  <li key={g.tempId} className="rounded-lg border border-gray-200/70 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {g.firstName} {g.lastName} {g.isChild && <span className="ml-2 text-xs text-gray-600">(child)</span>}
                        </div>
                        <div className="text-xs text-gray-600">
                          {g.expectedGlutenFree ? "Expected GF" : "—"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`parent-${g.tempId}`}
                            checked={g.isParent}
                            onCheckedChange={(v) => toggleStagedParent(g.tempId, !!v)}
                          />
                          <Label htmlFor={`parent-${g.tempId}`}>Parent</Label>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => removeStaged(g.tempId)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={commitPartyToDB} disabled={staged.length === 0 || batchLoading}>
                {batchLoading ? "Committing..." : "Commit Party to DB"}
              </Button>
              <Button variant="outline" onClick={clearStaged} disabled={staged.length === 0}>
                Clear Builder
              </Button>
            </div>

            {batchError && <p className="text-sm text-red-600">{batchError}</p>}
            {batchResult && (
              <p className="text-sm text-green-700">
                Created {Array.isArray(batchResult) ? batchResult.length : 0} guests.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: one wide panel */}
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Guest Directory & RSVP Targets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search guests..."
                value={dbQuery}
                onChange={(e) => setDbQuery(e.target.value)}
                className="w-64"
              />
              <Button variant="secondary" onClick={() => loadGuests(dbQuery)} disabled={loadingGuests}>
                Search
              </Button>
              <Button variant="outline" onClick={() => { setDbQuery(""); loadGuests(""); }}>
                Clear
              </Button>
            </div>
            <Button variant="secondary" onClick={() => loadGuests(dbQuery)} disabled={loadingGuests}>
              Reload
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left: select a guest (parent) */}
            <div className="rounded-xl border border-gray-200/70 p-3">
              <p className="mb-2 text-sm text-gray-700">Select a guest to edit their RSVP targets:</p>
              {errorGuests && <p className="text-sm text-red-600">{errorGuests}</p>}
              <div className="max-h-[360px] overflow-auto">
                <ul className="space-y-1">
                  {dbGuests.map((g) => (
                    <li key={g.id}>
                      <button
                        type="button"
                        onClick={() => selectParent(g)}
                        className={cn(
                          "w-full rounded-md border px-3 py-2 text-left text-sm transition hover:bg-white",
                          selectedParent?.id === g.id ? "border-pink-500 ring-1 ring-pink-500" : "border-gray-200"
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

            {/* Right: edit targets for selected guest */}
            <div className="rounded-xl border border-gray-200/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray-700">
                  {selectedParent ? (
                    <>
                      Editing RSVP targets for{" "}
                      <span className="font-medium text-gray-900">
                        {selectedParent.firstName} {selectedParent.lastName}
                      </span>
                    </>
                  ) : (
                    "Pick a guest on the left"
                  )}
                </p>
                <Input
                  placeholder="Filter targets..."
                  value={childFilter}
                  onChange={(e) => setChildFilter(e.target.value)}
                  className="h-8 w-44"
                />
              </div>

              <div className="mt-2 max-h-[320px] overflow-auto">
                {!selectedParent ? (
                  <p className="text-sm text-gray-600">No guest selected.</p>
                ) : (
                  <ul className="space-y-2">
                    {filteredChildrenList.map((g) => {
                      const isSelf = g.id === selectedParent.id;
                      const checked = isSelf || childrenSet.has(g.id);
                      return (
                        <li key={g.id} className="flex items-center gap-3">
                          <Checkbox
                            id={`target-${g.id}`}
                            checked={checked}
                            disabled={isSelf} // always enforced
                            onCheckedChange={(v) => toggleChild(g.id, !!v)}
                          />
                          <Label htmlFor={`target-${g.id}`} className="text-sm">
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
                <Button type="button" onClick={savePermissions} disabled={!selectedParent || permLoading}>
                  Save Permissions
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => selectedParent && selectParent(selectedParent)}
                  disabled={!selectedParent || permLoading}
                >
                  Refresh
                </Button>
              </div>

              {permError && <p className="mt-2 text-sm text-red-600">{permError}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 flex items-center justify-center">
        <AlertDialog open={wipeOpen} onOpenChange={(o) => { setWipeOpen(o); if (!o) { setWipeTyping(""); setWipeMsg(null); } }}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Danger Zone: Wipe Database</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Erase all data?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>all guests, permissions, RSVP history, and messages</strong>.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                To confirm, type <code className="rounded bg-gray-100 px-1 py-0.5">ERASE ALL DATA</code>:
              </p>
              <Input
                value={wipeTyping}
                onChange={(e) => setWipeTyping(e.target.value)}
                placeholder="ERASE ALL DATA"
              />
              {wipeMsg && (
                <p className={cn("text-sm", wipeMsg.includes("successfully") ? "text-green-700" : "text-red-600")}>
                  {wipeMsg}
                </p>
              )}
              {process.env.NEXT_PUBLIC_SHOW_DESTRUCTIVE_HINT === "true" && (
                <p className="text-xs text-gray-500">
                  (This endpoint requires <code>ALLOW_DESTRUCTIVE=true</code> on the server.)
                </p>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={wipeLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={doWipe}
                disabled={wipeTyping !== "ERASE ALL DATA" || wipeLoading}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              >
                {wipeLoading ? "Erasing..." : "Erase Everything"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function cryptoRandom() {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const buf = new Uint32Array(2);
    window.crypto.getRandomValues(buf);
    return `${buf[0].toString(16)}${buf[1].toString(16)}`;
  }
  return Math.random().toString(16).slice(2);
}