'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/*
  Глобальный слой анимации re:project.
  — плавное появление блоков при скролле (с задержкой «лесенкой» внутри сетки)
  — тонкая полоса прогресса скролла
  — шапка: становится стеклянной при скролле и прячется при прокрутке вниз
  — «магнитные» кнопки на десктопе
  — счётчики цифр [data-count]
  Всё отключается при prefers-reduced-motion.
*/

const REVEAL = [
  'main section .sectionTag',
  'main section .eyebrow',
  'main section h2',
  'main section h3',
  'main section > div > p',
  'main section .sectionHead p',
  'main section .lead',
  'main section .aboutGrid p',
  'main section .authorTeam',
  'main section .authorPhotoWrap',
  'main section .choiceButton',
  'main section .serviceCard',
  'main section .architectureCard',
  'main section .architectureLink',
  'main section .educationPreviewInner p',
  'main section .outline',
  'main section .light',
  'footer > *',
].join(',');

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    root.classList.add('motionReady');

    /* ---------- reveal on scroll ---------- */
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL)).filter(
      (el) => !el.closest('.hero') && !el.classList.contains('rv'),
    );
    let io: IntersectionObserver | null = null;
    if (!reduce && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              (e.target as HTMLElement).classList.add('rvIn');
              io?.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      const vh = window.innerHeight;
      targets.forEach((el) => {
        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        const idx = Math.max(0, siblings.indexOf(el));
        el.style.setProperty('--rvDelay', `${Math.min(idx, 6) * 80}ms`);
        el.classList.add('rv');
        // то, что уже на экране — показываем сразу, без мигания
        if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('rvIn');
        else io!.observe(el);
      });
    }

    /* ---------- counters ---------- */
    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
    const runCounter = (el: HTMLElement) => {
      const end = Number(el.dataset.count || 0);
      if (reduce) { el.textContent = String(end); return; }
      const start = performance.now();
      const dur = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = String(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    let cio: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      cio = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { runCounter(e.target as HTMLElement); cio?.unobserve(e.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach((c) => cio!.observe(c));
    } else counters.forEach(runCounter);

    /* ---------- scroll: progress, header, floating CTA ---------- */
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        root.style.setProperty('--scrollP', String(max > 0 ? y / max : 0));
        root.classList.toggle('isScrolled', y > 24);
        const goingDown = y > lastY + 4;
        const goingUp = y < lastY - 4;
        if (goingDown && y > 420) root.classList.add('navHidden');
        else if (goingUp || y < 420) root.classList.remove('navHidden');
        lastY = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- magnetic buttons ---------- */
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const mags = fine && !reduce ? Array.from(document.querySelectorAll<HTMLElement>('main .dark, main .light, .floatCta')) : [];
    const move = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const leave = (e: PointerEvent) => { (e.currentTarget as HTMLElement).style.transform = ''; };
    mags.forEach((m) => { m.classList.add('magnetic'); m.addEventListener('pointermove', move); m.addEventListener('pointerleave', leave); });

    return () => {
      io?.disconnect();
      cio?.disconnect();
      window.removeEventListener('scroll', onScroll);
      mags.forEach((m) => { m.removeEventListener('pointermove', move); m.removeEventListener('pointerleave', leave); m.style.transform = ''; });
    };
  }, [pathname]);

  return <div className="scrollProgress" aria-hidden="true" />;
}
