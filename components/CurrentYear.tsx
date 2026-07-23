"use client";

import { useEffect, useState } from "react";

export default function CurrentYear() {
  const [year, setYear] = useState("2024");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only Jahr nach Hydration
    setYear(String(new Date().getFullYear()));
  }, []);
  return <span id="current-year">{year}</span>;
}
