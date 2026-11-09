import { TESTIMONIALS } from '@/lib/content';
import SectionHeading from './SectionHeading';

const initials = (n) => n.split(' ').map((p) => p[0]).join('');
const tints = ['bg-signal-tint', 'bg-marigold-tint', 'bg-mint-tint'];

export default function Testimonials() {
  const [lead, ...rest] = TESTIMONIALS;
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHeading title="What our students say" />
        <figure className="mt-12 rounded-3xl bg-signal p-8 text-white md:p-14">
          <blockquote className="max-w-3xl font-display text-3xl font-bold leading-tight md:text-5xl">"{lead.quote}"</blockquote>
          <figcaption className="mt-6 font-semibold text-white/80">{lead.name}, student</figcaption>
        </figure>
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((t, i) => (
            <li key={t.name}>
              <figure className="h-full rounded-2xl bg-chalk p-6">
                <blockquote className="leading-7">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-sm font-semibold">
                  <span aria-hidden className={`grid h-9 w-9 place-items-center rounded-full ${tints[i % 3]}`}>{initials(t.name)}</span>
                  {t.name}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
