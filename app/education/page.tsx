import Header from '@/components/Header';
import Link from 'next/link';
import { educationBundles, educationProducts } from '@/lib/education';

const rub = (v: string) => Number(v.replace(/\D/g, '')) || 0;
const fmt = (n: number) => `${n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ')} ₽`;

function FileStack({ format }: { format: string }) {
  const table = /табл|pipeline/i.test(format);
  return <div className="fileStack" aria-hidden="true">
    <div className="fileSheet fs1"><i/><i/><i/><i/><i/><em>PDF</em></div>
    <div className={`fileSheet fs2${table ? ' isTable' : ''}`}>{table ? <div className="fileGrid">{Array.from({ length: 16 }).map((_, k) => <span key={k}/>)}</div> : <><i/><i/><i/></>}<em>{table ? 'XLSX' : 'DOC'}</em></div>
    <div className="fileSheet fs3"><i/><i/><i/><i/></div>
  </div>;
}

export default function EducationPage(){
 return <><Header/><main>
  <section className="educationHero"><div className="eyebrow">RE:PROJECT / FOR DESIGNERS</div><h1>Рабочие инструменты<br/><em>для дизайнера.</em></h1><p>Практическая база для дизайнеров: готовые кейсы, шаблоны, чеклисты, таблицы и рабочие системы. Без уроков и домашней работы — каждый материал решает конкретную задачу и сразу используется в практике.</p><div className="educationHeroMeta"><span>КУПИЛ ПОЛУЧИЛ ИСПОЛЬЗУЕШЬ</span><span>БЕЗ ПРОВЕРОК И СОПРОВОЖДЕНИЯ</span></div></section>
  <section className="educationIntro"><div className="sectionTag">01 / FORMAT</div><div className="educationTwo"><div><div className="eyebrow">КАК ЭТО РАБОТАЕТ</div><h2>Не проходить.<br/><em>Применять.</em></h2></div><div><p className="educationLead">Я собираю собственные рабочие процессы в отдельные продукты: документы, таблицы, сценарии, чеклисты и готовые структуры.</p><div className="educationSteps"><div><b>01</b><span>Выбираете конкретную задачу</span></div><div><b>02</b><span>Покупаете готовый набор</span></div><div><b>03</b><span>Получаете материалы и используете их самостоятельно</span></div></div></div></div></section>
  <section className="educationCatalog"><div className="sectionTag">02 / CASES</div><div><div className="sectionHead"><div><div className="eyebrow">CASE LIBRARY</div><h2>Выберите<br/><em>задачу.</em></h2></div><p>Каждый кейс самостоятельный. Можно покупать по одному или собрать рабочую систему из нескольких наборов.</p></div><div className="educationGrid">{educationProducts.map(p=><Link href={`/education/${p.slug}`} className="educationCard" key={p.slug}><FileStack format={p.format}/><div className="educationCardTop"><small>{p.num} / {p.category}</small><span>{p.price}</span></div><h3>{p.title}</h3><p>{p.short}</p><div className="educationCardBottom"><span>{p.format}</span><b>Открыть кейс <span className="arrowIcon"></span></b></div></Link>)}</div></div></section>
  <section className="educationBundles"><div className="sectionTag">03 / SETS</div><div><div className="sectionHead"><div><div className="eyebrow">READY SETS</div><h2>Собранные<br/><em>системы.</em></h2></div><p>Если нужна не одна форма, а полноценная база — готовые комплекты собирают несколько кейсов в одну рабочую систему.</p></div><div className="bundleGrid">{educationBundles.map(b=>{const items=b.included.map(id=>educationProducts.find(p=>p.slug===id)).filter((p):p is NonNullable<typeof p>=>Boolean(p));const sum=items.reduce((a,p)=>a+rub(p.price),0);const save=sum-rub(b.price);return <div className="bundleCard" key={b.slug}><small>{b.num} / SET</small><h3>{b.title}</h3><p>{b.description}</p><div className="bundleItems">{items.map((p,i)=><span key={p.slug} style={{['--i' as string]:i} as React.CSSProperties}><b>{p.title}</b><s>{p.price}</s></span>)}</div><div className="bundlePrice">{save>0&&<s className="bundleOld">{fmt(sum)}</s>}<span className="bundleNew">{b.price}</span>{save>0&&<span className="bundleSave">выгода {fmt(save)}</span>}</div><Link className="dark" href={`/education/${b.slug}`}>Смотреть состав <span className="arrowIcon"></span></Link></div>})}</div></div></section>
  <section className="educationManifesto"><div className="eyebrow">RE:PROJECT EDUCATION</div><h2><span className="strike">Не учиться ради обучения.</span><br/><em>Систематизировать практику.</em></h2><p>Материалы созданы на основе реальной практики архитектора и дизайнера: от первого сообщения клиента до реализации, комплектации и упаковки собственных знаний в цифровые продукты.</p></section>
 </main></>
}
