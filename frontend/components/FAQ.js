import { Plus } from 'lucide-react';
import { FAQ as ITEMS } from '@/lib/content';
import SectionHeading from './SectionHeading';

export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading title="Frequently asked questions" />
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {ITEMS.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                {q}
                <Plus aria-hidden className="shrink-0 transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-prose leading-7 text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
