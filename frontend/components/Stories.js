import { STORIES } from '@/lib/content';
import SectionHeading from './SectionHeading';

export default function Stories() {
  return (
    <section id="stories" className="section bg-white">
      <div className="container-x">
        <SectionHeading title="Real students. Real apps. Real results.">
          Every project below was designed, built and launched by a teenager in our program.
        </SectionHeading>
        <ul className="mt-12 grid gap-6 md:grid-cols-6">
          {STORIES.map((s, i) => {
            const feature = i === 0;
            const tall = i === 1; // the only vertical card
            const span = feature ? 'md:col-span-4' : tall ? 'md:col-span-2' : 'md:col-span-3';
            const dir = tall ? '' : 'md:flex-row';
            return (
              <li key={s.name} className={`group flex flex-col overflow-hidden rounded-2xl ${span} ${dir} ${feature ? 'bg-ink text-white' : 'bg-chalk'}`}>
                <div className={`overflow-hidden bg-chalk-deep ${tall ? 'aspect-[4/3]' : 'aspect-[16/10] md:aspect-auto md:min-h-[220px] md:w-2/5'} ${feature ? 'md:w-1/2' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={`${s.name} app screenshot`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className={`flex flex-1 flex-col justify-center p-6 ${feature ? 'md:p-10' : ''}`}>
                  <p className={`text-sm font-semibold ${feature ? 'text-marigold' : 'text-signal'}`}>{s.tag}</p>
                  <h3 className={`mt-1 font-bold ${feature ? 'text-3xl' : 'text-xl'}`}>{s.name}</h3>
                  <p className={`mt-3 leading-7 ${feature ? 'text-white/80' : 'text-ink-soft'}`}>{s.note}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
