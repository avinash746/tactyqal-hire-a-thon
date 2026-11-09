import { PHASES } from '@/lib/content';
import SectionHeading from './SectionHeading';

export default function Program() {
  return (
    <section id="program" className="section">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading title="From idea to full app in 8 weeks">
            One live 1-hour session a week, plus 2-3 hours of your teen's own build time.
          </SectionHeading>
          <figure className="mt-10 border-l-4 border-marigold pl-5">
            <blockquote className="font-display text-xl font-bold leading-snug">
              "Learn to sell. Learn to build. If you can do both, you will be unstoppable."
            </blockquote>
            <figcaption className="mt-2 text-sm text-ink-mute">Naval Ravikant</figcaption>
          </figure>
        </div>
        <ol className="relative space-y-8 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-ink/15">
          {PHASES.map((p) => (
            <li key={p.weeks} className="relative pl-12">
              <span aria-hidden className="absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-chalk"><span className="h-2.5 w-2.5 rounded-full bg-signal" /></span>
              <p className="text-sm font-bold text-signal">{p.weeks}</p>
              <h3 className="mt-1 text-2xl font-bold">{p.title}</h3>
              <p className="mt-2 max-w-md leading-7 text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
