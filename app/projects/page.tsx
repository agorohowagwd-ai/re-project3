import Header from '@/components/Header';
import HouseVisual from '@/components/HouseVisual';
import Link from 'next/link';
import { architectureOffer, architectureProjects } from '@/lib/projects';
import ScopeStages from '@/components/ScopeStages';

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="projectsHero">
          <div className="eyebrow">ARCHITECTURE / READY PROJECTS</div>
          <h1 className="heroTitle"><span className="ln"><span>Дом от идеи</span></span><span className="ln"><span><em>до готового интерьера.</em></span></span></h1>
          <p>{architectureOffer.scope} Мы работаем с проверенными бригадами и поставщиками и сопровождаем проект на всех этапах реализации.</p>
          <div className="heroProof projectsProof">
            <div className="proofItem"><b>{architectureOffer.price}</b><span>стоимость<br />типового проекта</span></div>
            <div className="proofItem"><b><span data-count="5">5</span>+</b><span>домов построено<br />по re:project 1</span></div>
            <div className="proofItem"><b><span data-count="5">5</span> правок</b><span>на всех этапах<br />проектирования</span></div>
          </div>
        </section>

        <section className="projectsSection">
          <div className="sectionTag">01 / PROJECTS</div>
          <div>
            <div className="projectsHead">
              <div>
                <div className="eyebrow">ТИПОВЫЕ ПРОЕКТЫ</div>
                <h2>re:project<br /><em>1—3.</em></h2>
              </div>
              <p>Три типовых архитектурных решения, разработанных вокруг разных сценариев семейной жизни. Каждый проект можно адаптировать под участок и задачи заказчика, сохраняя целостность архитектурного образа.</p>
            </div>

            <div className="projectGrid">
              {architectureProjects.map((project) => (
                <Link href={`/projects/${project.id}`} className="projectCard" key={project.id}>
                  {project.exterior ? (
                    <img className="projectImage" src={project.exterior} alt={`${project.title} — визуализация экстерьера`} />
                  ) : (
                    <HouseVisual variant={project.accent} />
                  )}
                  <span className="cardHover">Смотреть проект <span className="arrowIcon"></span></span>
                  <div className="projectCardBody">
                    <div className="projectMeta"><span>{project.number}</span><span>{project.typeLabel || 'ТИПОВОЙ ПРОЕКТ'}</span></div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.area !== '—' && <div className="projectStats"><span>{project.area}</span><span>{project.floors}</span><span>{project.bedrooms}</span></div>}
                    <div className="projectOpen">Смотреть проект <b><span className="arrowIcon"></span></b></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="architectureOfferSection">
          <div className="sectionTag">02 / SCOPE</div>
          <div className="offerGrid">
            <div>
              <div className="eyebrow">ЧТО ВХОДИТ</div>
              <h2>Один проект.<br /><em>Полный цикл.</em></h2>
            </div>
            <div className="offerDetails">
              <p className="offerLead">Готовый проект от 0 до чистовой отделки с готовым интерьером.</p>
              <ScopeStages items={architectureOffer.sections} />
              <div className="offerRows">
                <div><b>200 000 ₽</b><span>стоимость типового проекта</span></div>
                <div><b>5 правок</b><span>на всех этапах проектирования</span></div>
                <div><b>Полный цикл</b><span>вовлеченность на всех этапах + авторский надзор</span></div>
                <div><b>Проверенные</b><span>бригады и поставщики</span></div>
              </div>
              <Link href="/projects/request" className="dark">Обсудить проект <span className="arrowIcon"></span></Link>
            </div>
          </div>
        </section>

        <section className="projectNote">
          <div className="eyebrow">ADAPTIVE ARCHITECTURE</div>
          <h2>Один фасад.<br /><em>Разные сценарии жизни.</em></h2>
          <p>Планировка может конструктивно меняться под задачу семьи: например, дополнительная зона сауны и парной может быть заменена на детские комнаты или другие функциональные помещения. При этом внешний облик дома остаётся цельным и органичным.</p>
          <Link href="/projects/re-project-1#constructor" className="outline">Открыть конструктор re:project 1 <span className="arrowIcon"></span></Link>
        </section>
      </main>
    </>
  );
}
