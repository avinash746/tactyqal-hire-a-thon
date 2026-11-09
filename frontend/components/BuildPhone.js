'use client';
import { useEffect, useState } from 'react';
import { Check, Leaf, Lightbulb, Rocket } from 'lucide-react';
import { PHASES } from '@/lib/content';

const AUTO_MS = 4500;

function Screen({ phase }) {
  if (phase === 0)
    return (
      <div className="animate-screen-in space-y-3 p-4">
        <p className="font-display text-sm font-bold">Problem notes</p>
        <div className="-rotate-1 rounded-lg bg-marigold-tint p-3 text-xs font-medium shadow-sm">Farmers can't afford soil tests</div>
        <div className="rotate-1 rounded-lg bg-mint-tint p-3 text-xs font-medium shadow-sm">10 farmers interviewed</div>
        <div className="-rotate-1 rounded-lg bg-signal-tint p-3 text-xs font-medium shadow-sm">No local competitor found</div>
        <div className="flex items-center gap-2 pt-1 text-[11px] text-ink-mute"><Lightbulb size={14} /> Idea checked with real people</div>
      </div>
    );
  if (phase === 1)
    return (
      <div className="animate-screen-in space-y-3 p-4">
        <div className="h-8 rounded-md border-2 border-dashed border-ink/25" />
        <div className="grid h-24 place-items-center rounded-md border-2 border-dashed border-ink/25 text-[11px] text-ink-mute">photo of soil</div>
        <div className="h-6 w-3/4 rounded-md border-2 border-dashed border-ink/25" />
        <div className="h-6 w-1/2 rounded-md border-2 border-dashed border-ink/25" />
        <div className="grid h-10 place-items-center rounded-full border-2 border-dashed border-signal text-[11px] font-semibold text-signal">Analyse soil</div>
      </div>
    );
  if (phase === 2)
    return (
      <div className="animate-screen-in">
        <div className="flex items-center gap-2 bg-mint px-4 py-3 text-sm font-bold text-ink"><Leaf size={16} /> KrishiDrishti</div>
        <div className="space-y-3 p-4">
          <div className="rounded-xl bg-chalk p-3">
            <p className="text-[11px] text-ink-mute">Soil pH</p>
            <p className="font-display text-2xl font-bold">6.4</p>
            <div className="mt-2 h-2 rounded-full bg-chalk-deep"><div className="h-2 w-3/5 rounded-full bg-mint" /></div>
          </div>
          <div className="rounded-xl bg-marigold-tint p-3 text-xs">Recommended crop <strong className="block text-sm">Wheat</strong></div>
          <div className="grid h-10 place-items-center rounded-full bg-signal text-xs font-semibold text-white">Analyse soil</div>
        </div>
      </div>
    );
  return (
    <div className="animate-screen-in space-y-3 p-4">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-mint text-ink"><Rocket size={22} /></div>
      <p className="font-display text-lg font-bold leading-tight">Your app is live</p>
      <ul className="space-y-2 text-xs">
        {['Launched on Product Hunt', 'Pitch deck ready', 'Marketing plan running'].map((t) => (
          <li key={t} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-mint text-ink"><Check size={12} strokeWidth={3} /></span>{t}</li>
        ))}
      </ul>
    </div>
  );
}

export default function BuildPhone() {
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setAuto(false); return; }
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [auto, phase]);

  const pick = (i) => { setAuto(false); setPhase(i); };

  return (
    <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr] lg:grid-cols-1 xl:grid-cols-[auto_1fr]">
      <div className="mx-auto w-[230px] shrink-0 rounded-[2.2rem] bg-ink p-2.5 shadow-[0_30px_60px_-20px_rgba(14,22,53,.5)]" role="img" aria-label={`App being built, stage ${phase + 1} of 4: ${PHASES[phase].title}`}>
        <div className="h-[420px] overflow-hidden rounded-[1.7rem] bg-white">
          <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-ink/10" />
          <Screen phase={phase} key={phase} />
        </div>
      </div>

      <div role="tablist" aria-label="Program stages" className="space-y-2">
        {PHASES.map((p, i) => {
          const active = i === phase;
          return (
            <button
              key={p.weeks} role="tab" aria-selected={active} onClick={() => pick(i)}
              className={`relative block w-full overflow-hidden rounded-xl border-2 px-4 py-3 text-left transition-colors ${active ? 'border-ink bg-white' : 'border-transparent hover:bg-white/70'}`}
            >
              <span className="block text-sm font-bold">{p.weeks}</span>
              <span className="block text-sm text-ink-soft">{p.title}</span>
              {active && auto && <span key={phase} className="absolute inset-x-0 bottom-0 h-1 origin-left animate-progress bg-marigold" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
