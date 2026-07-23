"use client";

import { useEffect, useState } from "react";

/** Betreff-Code mit heutigem Datum (ersetzt den Jinja-Platzhalter "HEUTIGES DATUM"). */
export default function JobDateCode() {
  const [today, setToday] = useState("HEUTIGES DATUM");
  useEffect(() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only Datum nach Hydration
    setToday(`${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`);
  }, []);
  return (
    <code style={{ background: "#fff", padding: "2px 5px", border: "1px solid #ccc" }}>
      IB-B_MÜ_BEW_{today}
    </code>
  );
}
