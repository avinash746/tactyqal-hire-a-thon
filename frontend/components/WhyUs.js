import * as Icons from 'lucide-react';
import { WHY } from '@/lib/content';
import SectionHeading from './SectionHeading';

export default function WhyUs() {
  return (
    <section id="why" className="section bg-ink text-white">
      <div className="container-x">
        <SectionHeading title="Why parents choose Tactyqal Labs" />
        <dl className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {WHY.map((w) => {
            const Icon = Icons[w.icon];
            return (
              <div key={w.title} className="flex gap-4 border-t border-white/15 pt-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-marigold text-ink"><Icon size={22} aria-hidden /></span>
                <div>
                  <dt className="text-lg font-bold">{w.title}</dt>
                  <dd className="mt-1 leading-7 text-white/70">{w.text}</dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
