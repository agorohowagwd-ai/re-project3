'use client';
import { useEffect, useRef, useState } from 'react';

/*
  Конструктор re:project 1: переключение сценария левого крыла
  (сауна и парная ↔ детские) на настоящем плане. Фасад не меняется.
  Положение зоны задано в процентах от плана 1536×1024.
*/
const scenarios = {
  sauna: { title: 'Сауна и парная', text: 'Можно сохранить отдельную wellness-зону с комнатой отдыха, душевой и парной.' },
  kids: { title: 'Детские комнаты', text: 'Ту же часть дома можно перераспределить в дополнительные спальни или детские, если состав семьи этого требует.' },
};

export default function PlanConstructor({ plan, alt }: { plan: string; alt: string }) {
  const [mode, setMode] = useState<'sauna' | 'kids'>('sauna');
  const [printed, setPrinted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setPrinted(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPrinted(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const kids = mode === 'kids';
  const s = scenarios[mode];

  return (
    <div className="planConstructor">
      <div className="planToggle" role="group" aria-label="Сценарий планировки">
        <button type="button" className={!kids ? 'isActive' : ''} aria-pressed={!kids} onClick={() => setMode('sauna')}>Сауна и парная</button>
        <button type="button" className={kids ? 'isActive' : ''} aria-pressed={kids} onClick={() => setMode('kids')}>Детские комнаты</button>
      </div>
      <div ref={ref} className={`planPlot${printed ? ' isPrinted' : ''}`}>
        <img src={plan} alt={alt} />
        <div className={`planZone planZoneMark${kids ? ' isOff' : ''}`} aria-hidden="true" />
        <div className={`planZone planKids${kids ? ' isOn' : ''}`} aria-hidden="true">
          <div><span>ДЕТСКАЯ 1</span></div>
          <div><span>ДЕТСКАЯ 2</span></div>
        </div>
        <div className="planHead" aria-hidden="true" />
      </div>
      <div className="planNotes">
        <div className="detailCallout" aria-live="polite"><b>{s.title}</b><span>{s.text}</span></div>
        <div className="detailCallout"><b>Фасад остаётся цельным</b><span>Изменения происходят внутри планировочной схемы, поэтому архитектурный образ и пропорции фасадов сохраняются органичными.</span></div>
      </div>
    </div>
  );
}
