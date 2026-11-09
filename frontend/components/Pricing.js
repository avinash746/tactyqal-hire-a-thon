import { Check } from 'lucide-react';
import { PLAN, CONTACT } from '@/lib/content';

export default function Pricing() {
  return (
    <section id="pricing" className="section bg-marigold-tint">
      <div className="container-x">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-xl md:p-10">
          <h2 className="text-3xl font-extrabold leading-tight">Start your teen's entrepreneurial journey</h2>
          <p className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-5xl font-extrabold">₹16,000</span>
            <span className="text-xl text-ink-mute line-through">₹25,000</span>
          </p>
          <ul className="mt-6 space-y-3">
            {PLAN.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-mint text-ink"><Check size={14} strokeWidth={3} aria-hidden /></span>{p}
              </li>
            ))}
          </ul>
          <a href={CONTACT.calendar} target="_blank" rel="noreferrer" className="btn-primary mt-8 w-full">Enroll now</a>
          <p className="mt-4 text-center text-sm text-ink-soft">Results guaranteed or money back. Limited-time offer: only 15 spots available each month.</p>
        </div>
      </div>
    </section>
  );
}
