// app/rsvp/_bg/StarsLayer.tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export default function StarsLayer({ children }: { children: React.ReactNode }) {
  const [root, setRoot] = React.useState<Element | null>(null);
  React.useEffect(() => {
    setRoot(document.getElementById("rsvp-stars-root"));
  }, []);
  if (!root) return null;
  return createPortal(<div className="absolute inset-0">{children}</div>, root);
}