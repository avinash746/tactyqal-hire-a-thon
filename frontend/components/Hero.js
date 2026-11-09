import { CONTACT } from '@/lib/content';
import BuildPhone from './BuildPhone';

export default function Hero() {
  return (
    <section id="home" className="overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="inline-block rounded-full bg-marigold-tint px-4 py-1.5 text-sm font-semibold">
            Limited-time price: ₹16,000 <span className="text-ink-mute line-through">₹25,000</span>
          </p>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
            Your teen's idea, a launched app in 8 weeks.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
            Personal 1:1 mentoring takes a student from first idea to a full-stack app with real users. No coding needed.
            Past students have earned revenue, won grants, been covered by the media and earned places at top universities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={CONTACT.calendar} target="_blank" rel="noreferrer" className="btn-primary">Book free consultation</a>
            <a href="#stories" className="btn-ghost">See what students built</a>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/10 pt-6">
            {[['100+', 'students mentored'], ['8 weeks', 'idea to launch'], ['1:1', 'every session']].map(([n, l]) => (
              <div key={l}><dt className="font-display text-2xl font-extrabold">{n}</dt><dd className="text-sm text-ink-mute">{l}</dd></div>
            ))}
          </dl>
        </div>
        <div>
          <BuildPhone />
          <p className="mt-4 text-center text-xs text-ink-mute lg:text-left">Illustration of a typical build, inspired by student app KrishiDrishti.</p>
        </div>
      </div>
    </section>
  );
}
