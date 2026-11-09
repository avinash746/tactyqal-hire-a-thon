'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { NAV, CONTACT } from '@/lib/content';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-chalk/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" aria-label="Tactyqal Labs home" onClick={() => setOpen(false)}><Logo /></Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-ink-soft transition-colors hover:text-signal">{l.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={CONTACT.calendar} target="_blank" rel="noreferrer" className="btn-primary hidden !px-5 !py-2 text-sm sm:inline-flex">Book free consultation</a>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg hover:bg-chalk-deep lg:hidden"
            aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-ink/10 bg-chalk lg:hidden">
          <ul className="container-x flex flex-col py-3">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-3 font-medium hover:bg-chalk-deep">{l.label}</Link>
              </li>
            ))}
            <li className="pt-2">
              <a href={CONTACT.calendar} target="_blank" rel="noreferrer" className="btn-primary w-full">Book free consultation</a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
