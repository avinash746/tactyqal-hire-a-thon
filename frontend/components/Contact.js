import { Mail, Phone, Clock, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/content';

export default function Contact() {
  const rows = [
    [Mail, 'Email', CONTACT.email, `mailto:${CONTACT.email}`],
    [Phone, 'Phone', CONTACT.phone, CONTACT.phoneHref],
    [Clock, 'Hours', CONTACT.hours],
    [MessageCircle, 'Response time', CONTACT.response]
  ];
  return (
    <section id="contact" className="section bg-signal text-white">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">Ready to start your teen's success story?</h2>
          <p className="mt-4 max-w-md text-lg text-white/80">Book a free appointment and we'll talk through ideas, goals and fit.</p>
          <a href={CONTACT.calendar} target="_blank" rel="noreferrer" className="btn mt-8 bg-marigold text-ink hover:bg-white">Book a free appointment</a>
        </div>
        <ul className="space-y-5 rounded-2xl bg-white/10 p-6 md:p-8">
          {rows.map(([Icon, label, value, href]) => (
            <li key={label} className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><Icon size={20} aria-hidden /></span>
              <div>
                <p className="text-sm text-white/70">{label}</p>
                {href ? <a href={href} className="font-semibold underline-offset-2 hover:underline">{value}</a> : <p className="font-semibold">{value}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
