"use client";

import { useCallback, useEffect, useState } from "react";
import { TELOS as FALLBACK, type Telos } from "./data";

// Maps the live /api/telos/overview response into the full Telos shape the dashboard renders.
// Every field is set explicitly (live data where the backend provides it, honest empties otherwise),
// so no sample/FALLBACK content leaks through. FALLBACK is used only as a typed base + on fetch error.
function mapOverview(d: any): Telos {
  const arr = (v: any) => (Array.isArray(v) ? v : []);
  return {
    owner: d.owner ?? { name: "", day: "", streak: 0 },
    idealState: d.idealState ?? { horizon: "", note: "" },
    dimensions: arr(d.dimensions),
    snapshot: arr(d.snapshot),
    problems: arr(d.problems).map((p: any) => ({
      id: p.id, title: p.title ?? "", note: p.note ?? "",
      severity: p.severity ?? "med", affects: arr(p.affects),
    })),
    missions: arr(d.missions).map((m: any) => ({
      id: m.id, title: m.title ?? "", horizon: m.horizon ?? "", addresses: arr(m.addresses),
    })),
    goals: arr(d.goals).map((g: any) => ({
      id: g.id, title: g.title ?? "", kpi: g.kpi ?? "", target: g.target ?? "",
      pct: typeof g.pct === "number" ? g.pct : 0,
      delta: typeof g.delta === "number" ? g.delta : 0,
      dims: arr(g.dims), metrics: arr(g.metrics),
    })),
    metrics: arr(d.metrics),
    challenges: arr(d.challenges).map((c: any) => ({
      id: c.id, title: c.title ?? "", note: c.note ?? "", blocks: arr(c.blocks),
    })),
    strategies: arr(d.strategies).map((s: any) => ({
      id: s.id, title: s.title ?? "", overcomes: arr(s.overcomes), implements: arr(s.implements),
    })),
    projects: arr(d.projects),
    team: arr(d.team),
    budget: arr(d.budget),
    recommendations: arr(d.recommendations),
    stranded: d.stranded ?? { work_no_goal: [], goals_no_strategy: [], strategies_idle: [] },
    subtabs: arr(d.subtabs),
    preferences: d.preferences ?? { books: [], films: [], anime: [], characters: [], aphorisms: [], hobbies: [], literature: [] },
    narrativeSeed: d.narrativeSeed ?? FALLBACK.narrativeSeed,
  };
}

export function useTelosData(): { telos: Telos | null; refetch: () => void; error: string | null } {
  const [telos, setTelos] = useState<Telos | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<number>(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/telos/overview")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => { if (!cancelled) { setTelos(mapOverview(d)); setError(null); } })
      .catch((e) => { if (!cancelled) { setError(String(e)); setTelos(FALLBACK); } });
    return () => { cancelled = true; };
  }, [version]);

  return { telos, refetch, error };
}
