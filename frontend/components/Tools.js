import { ArrowUpRight } from 'lucide-react';
import { TOOLS } from '@/lib/content';
import SectionHeading from './SectionHeading';

export default function Tools() {
  return (
    <section id="tools" className="section">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading title="Free tools to get started">Startup assessment tools used by 1000+ entrepreneurs.</SectionHeading>
          <a href="https://tactyqal.com/#tools" className="btn-ghost shrink-0">Open all tools</a>
        </div>
        <ul className="mt-10 flex flex-wrap gap-3">
          {TOOLS.map((t) => (
            <li key={t}>
              <a href="https://tactyqal.com/#tools" className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold shadow-sm ring-1 ring-ink/10 transition hover:bg-signal hover:text-white hover:ring-signal">
                {t}<ArrowUpRight size={16} aria-hidden className="opacity-50 group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-16 overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-ink/10 md:p-4">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_1.4fr]">
            <div className="p-4 md:p-6">
              <h3 className="text-2xl font-bold">Startup ideas 101</h3>
              <p className="mt-3 leading-7 text-ink-soft">Learn how to identify and validate profitable startup ideas from our founder.</p>
            </div>
            <div className="aspect-video overflow-hidden rounded-xl bg-ink">
              <iframe
                title="Startup ideas 101 video" loading="lazy" className="h-full w-full"
                src="https://www.youtube-nocookie.com/embed/UyUH06CfLbk?start=105"
                allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
