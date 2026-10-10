'use client';
import { useEffect, useRef, useState } from 'react';

/* Разделы проекта по очереди закрашиваются бордо, счётчик доходит до «5 из 5». */
export default function ScopeStages({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(0);
  const [on, setOn] = useState(false);
  const total = items.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { setOn(true); setDone(total); return; }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setOn(true);
      for (let i = 1; i <= total; i++) timers.push(setTimeout(() => setDone(i), 300 + (i - 1) * 450));
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [total]);

  return (
    <div className="scopeStages">
      <div ref={ref} className={`stages${on ? ' isOn' : ''}`}>
        {items.map((item, i) => (
          <div className="stage" key={item} style={{ ['--i' as string]: i } as React.CSSProperties}>
            <div className="stageRow"><span>{item}</span><b>{String(i + 1).padStart(2, '0')}</b></div>
            <div className="stageBar" />
          </div>
        ))}
      </div>
      <div className="stagesLabel" aria-live="polite">
        {done >= total ? `${total} из ${total} разделов — всё включено` : `${done} из ${total} разделов`}
      </div>
    </div>
  );
}
