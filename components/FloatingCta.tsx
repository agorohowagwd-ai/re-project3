'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* Плавающая кнопка записи: появляется после первого экрана,
   прячется, когда в кадре финальный CTA или подвал. */
export default function FloatingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    const ends = Array.from(document.querySelectorAll('.cta, footer'));
    let pastHero = false;
    let endVisible = false;
    const update = () => setShow(pastHero && !endVisible);

    const heroIo = new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; update(); }, { threshold: 0.05 });
    const visible = new Set<Element>();
    const endIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      endVisible = visible.size > 0;
      update();
    });
    if (hero) heroIo.observe(hero);
    ends.forEach((el) => endIo.observe(el));
    return () => { heroIo.disconnect(); endIo.disconnect(); };
  }, []);

  return (
    <Link href="/service/visual" className={`floatCta${show ? ' isOn' : ''}`} aria-hidden={!show} tabIndex={show ? 0 : -1}>
      <span className="floatCtaDot" />
      <span>Начать проект <i>от 2 000 ₽</i></span>
      <span className="arrowIcon" />
    </Link>
  );
}
