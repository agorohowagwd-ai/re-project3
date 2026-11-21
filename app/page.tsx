'use client';
import Link from 'next/link';
import { useState } from 'react';
import { services } from '@/lib/services';
import { architectureProjects } from '@/lib/projects';
import { educationProducts } from '@/lib/education';
import FloatingCta from '@/components/FloatingCta';
import './home.css';

const chips = [
  { label: 'Квартира', href: '/brief/apartment' },
  { label: 'Дом', href: '/brief/house' },
  { label: 'Интерьер', href: '/service/design' },
  { label: 'AI-визуализация', href: '/service/visual' },
  { label: 'Комплектация', href: '/service/equipment' },
];

const nav = [
  { label: 'Услуги', href: '/#services' },
  { label: 'Архитектура', href: '/projects' },
  { label: 'Для дизайнеров', href: '/education' },
  { label: 'О проекте', href: '/#about' },
];

function Arrow() {
  return <span className="xArrow" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const withImg = architectureProjects.filter((p) => p.exterior);

  return <div className="xPage"><main>
    <section className="xHero">
      <picture>
        <source media="(max-width: 860px)" srcSet="/home/hero-tall.jpg" />
        <img className="xHeroImg" src="/home/hero-wide.jpg" alt="Одноэтажный дом re:project в тёмной обшивке среди сосен" />
      </picture>
      <div className="xHeroShade" />

      <div className="xTop">
        <Link href="/" className="xBrand"><span className="xMark" aria-hidden="true"><i/><i/><i/><i/></span>re:project</Link>
        <nav className="xNav">{nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}</nav>
        <div className="xTopRight">
          <Link href="/account" className="xPill xPillLight">Личный кабинет</Link><Link href="/account" className="xCircle" aria-label="Личный кабинет"><Arrow/></Link>
          <button className="xBurger" onClick={() => setMenu(!menu)} aria-label="Меню" aria-expanded={menu}><i/><i/></button>
        </div>
        {menu && <div className="xMobileNav">{nav.map((n) => <a key={n.href} href={n.href} onClick={() => setMenu(false)}>{n.label}</a>)}<Link href="/account">Личный кабинет</Link></div>}
      </div>

      <div className="xHeroBody">
        <h1>Проектирую дома<br/>и интерьеры, в которых<br/>хочется жить</h1>
        <div className="xChips">{chips.map((c) => <Link key={c.label} href={c.href} className="xChip">{c.label}</Link>)}</div>
      </div>

      <div className="xSlider">
        <div className="xSliderBar"><span>01</span><i><b/></i><span>{String(withImg.length).padStart(2, '0')}</span></div>
        <div className="xSlides">{withImg.map((p) => <Link key={p.id} href={`/projects/${p.id}`} className="xSlide">
          <img src={p.exterior} alt={`${p.title} — экстерьер`} />
          <div><strong>{p.title}</strong><small>{[p.floors, p.area].filter((v) => v && v !== '—').join(' · ') || 'Типовой проект'}</small></div>
        </Link>)}</div>
      </div>
    </section>

    <section id="about" className="xAbout">
      <div className="xAboutSide">
        <span className="xIdx">(01)</span><span className="xLabel">О проекте</span>
        <p className="xSmall">Архитектор-дизайнер с 2018 года. Каркас, клеёный брус, керамика Porotherm. Собственная бригада и команда проектировщиков.</p>
      </div>
      <div className="xAboutMain">
        <p className="xStatement"><b>re:project</b> – авторский сервис, где <b>архитектура</b>, интерьер и <b>искусственный интеллект</b> работают на один результат – <b>дом, который</b> удобно строить и <b>приятно жить</b>.</p>
        <div className="xStats">
          <div><b>8</b><span>лет практики</span></div>
          <div><b>5+</b><span>домов построено по re:project 1</span></div>
          <div><b>2 000 ₽</b><span>старт работы над пространством</span></div>
        </div>
        <div className="xBtnRow"><Link href="/projects" className="xPill xPillGhost">Смотреть проекты</Link><Link href="/projects" className="xCircle" aria-label="Смотреть проекты"><Arrow/></Link></div>
      </div>
    </section>

    <section id="services" className="xSection">
      <div className="xHead"><div><span className="xIdx">(02)</span><span className="xLabel">Услуги</span></div><h2>Выберите <b>задачу</b> – начнём с неё</h2></div>
      <div className="xServices">{services.map((s) => <Link key={s.id} href={`/service/${s.id}`} className="xService">
        <div className="xServiceTop"><small>{s.num}</small><span className="xPrice">{s.price}</span></div>
        <h3>{s.title}</h3><p>{s.text}</p>
        <span className="xMore">Открыть услугу <Arrow/></span>
      </Link>)}</div>
    </section>

    <section id="architecture" className="xSection">
      <div className="xHead"><div><span className="xIdx">(03)</span><span className="xLabel">Архитектура</span></div><h2>Готовые проекты <b>re:project</b></h2></div>
      <div className="xProjects">{architectureProjects.map((p) => <Link key={p.id} href={`/projects/${p.id}`} className="xProject">
        {p.exterior ? <img src={p.exterior} alt={`${p.title} — визуализация экстерьера`} /> : <div className="xProjectEmpty" />}
        <div className="xProjectInfo"><div><small>{p.typeLabel ?? 'ТИПОВОЙ ПРОЕКТ'}</small><strong>{p.title}</strong></div><Arrow/></div>
      </Link>)}</div>
      <div className="xBtnRow"><Link href="/projects" className="xPill xPillGhost">Все проекты</Link><Link href="/projects" className="xCircle" aria-label="Все проекты"><Arrow/></Link></div>
    </section>

    <section className="xSection xSplit">
      <div className="xAuthor"><img src="/author.jpg" alt="Архитектор-дизайнер re:project" /></div>
      <div>
        <div className="xHead xHeadTight"><div><span className="xIdx">(04)</span><span className="xLabel">Автор</span></div></div>
        <p className="xStatement xStatementSm">Веду проекты <b>полного цикла</b>: от концепции и рабочей документации до <b>комплектации</b>, работы с подрядчиками и <b>авторского надзора</b>.</p>
        <p className="xSmall">Консультирую по реализуемости дизайн-проектов и помогаю адаптировать их под строительство, бюджет и требования заказчика.</p>
      </div>
    </section>

    <section className="xSection xEdu">
      <div className="xHead"><div><span className="xIdx">(05)</span><span className="xLabel">Для дизайнеров</span></div><div><h2 className="xBig">Инструменты, которые <b>работают в проекте</b></h2><p className="xSmall xLead">Готовые кейсы, чек-листы, шаблоны и рабочие системы – без уроков и домашних заданий. Купили, получили материалы, применили в своём проекте.</p></div></div>
      <div className="xEduGrid">{educationProducts.map((e) => <Link key={e.slug} href={`/education/${e.slug}`} className="xEduCard">
        <div className="xServiceTop"><small>{e.num} · {e.category}</small><span className="xPrice">{e.price}</span></div>
        <h3>{e.title}</h3>
        <span className="xMore">Открыть <Arrow/></span>
      </Link>)}</div>
      <div className="xBtnRow"><Link href="/education" className="xPill xPillLight">Все материалы</Link><Link href="/education" className="xCircle" aria-label="Все материалы"><Arrow/></Link></div>
    </section>

    <section className="xCta">
      <h2>Есть фотография? <b>Давайте изменим пространство.</b></h2>
      <div className="xBtnRow"><Link href="/service/visual" className="xPill xPillLight">Начать AI-визуализацию</Link><Link href="/service/visual" className="xCircle" aria-label="Начать AI-визуализацию"><Arrow/></Link></div>
    </section>
  </main>

  <footer className="xFooter">
    <div><b>re:project</b><p>architecture · interior · technology</p></div>
    <div><small>Контакты</small><a href="mailto:hello@reproject.ru">hello@reproject.ru</a><a href="https://t.me/reprojectarh" target="_blank" rel="noreferrer">Telegram-канал</a></div>
    <div><small>Юридическое</small><a href="/legal/contract">Договор оказания услуг</a><a href="/legal">Политика обработки данных</a></div>
    <p className="xCopy">© 2026 re:project</p>
  </footer>
  <FloatingCta/></div>;
}
