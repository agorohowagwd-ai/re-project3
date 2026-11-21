'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/#services', label: 'Услуги' },
  { href: '/projects', label: 'Архитектура' },
  { href: '/education', label: 'Для дизайнеров' },
  { href: '/#about', label: 'О проекте' },
];

function Arrow() {
  return <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname() || '';
  return <header className="header hdr">
    <div className="hdrBar">
      <Link href="/" className="hdrBrand"><span className="hdrMark" aria-hidden="true"><i/><i/><i/><i/></span>re:project</Link>
      <nav className="hdrNav">{links.map((l) => <a key={l.href} href={l.href} className={!l.href.startsWith('/#') && path.startsWith(l.href) ? 'on' : undefined}>{l.label}</a>)}</nav>
      <div className="hdrRight">
        <Link href="/account" className="hdrPill">Личный кабинет</Link>
        <Link href="/account" className="hdrCircle" aria-label="Личный кабинет"><Arrow/></Link>
        <button className="hdrBurger" onClick={() => setOpen(!open)} aria-label="Меню" aria-expanded={open}><i/><i/></button>
      </div>
    </div>
    {open && <div className="hdrMobile">{links.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}<Link href="/account" onClick={() => setOpen(false)}>Личный кабинет</Link></div>}
  </header>;
}
