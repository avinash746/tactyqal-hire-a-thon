import Link from 'next/link';
import Logo from './Logo';
import { CONTACT } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo className="text-white" />
          <p className="mt-4 text-sm leading-6 text-white/70">
            1:1 mentoring that helps teens turn ideas into real, launched apps.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm">
          <ul className="space-y-2">
            <li><Link className="text-white/70 hover:text-white" href="/#program">Program</Link></li>
            <li><Link className="text-white/70 hover:text-white" href="/#pricing">Pricing</Link></li>
            <li><Link className="text-white/70 hover:text-white" href="/blog">Blog</Link></li>
            <li><Link className="text-white/70 hover:text-white" href="/admin">Blog admin demo</Link></li>
          </ul>
          <ul className="space-y-2 text-white/70">
            <li><a className="hover:text-white" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            <li><a className="hover:text-white" href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
            <li>{CONTACT.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Tactyqal Labs. Redesign submitted for the Full Stack Developer Intern hire-a-thon.
      </div>
    </footer>
  );
}
