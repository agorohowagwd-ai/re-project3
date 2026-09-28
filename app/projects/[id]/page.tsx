import Header from '@/components/Header';
import HouseVisual from '@/components/HouseVisual';
import PlanVisual from '@/components/PlanVisual';
import Link from 'next/link';
import { architectureOffer, getArchitectureProject } from '@/lib/projects';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = getArchitectureProject(params.id);
  if (!project) return <><Header /><main className="notFound"><h1>Проект не найден.</h1><Link href="/projects" className="dark">Вернуться к проектам</Link></main></>;

  return (
    <>
      <Header />
      <main>
        <section className="projectDetailHero">
          <div className="projectDetailText">
            <Link href="/projects" className="back">← Все типовые проекты</Link>
            <div className="eyebrow">{project.number} / {project.typeLabel || 'ТИПОВОЙ ПРОЕКТ'}</div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            {project.id === 're-project-1' && <div className="projectProof"><b>5+</b><span>домов уже возведено<br />по этому проекту</span></div>}
            <div className="detailPrice"><small>СТОИМОСТЬ</small><strong>{architectureOffer.price}</strong></div>
            <div className="detailSpecs">
              <div><small>ФОРМАТ</small><b>Типовой проект</b></div>
              <div><small>ЦИКЛ</small><b>До чистовой отделки</b></div>
              <div><small>ИНТЕРЬЕР</small><b>Включён</b></div>
            </div>
          </div>
          {project.exterior ? <img className="detailProjectImage" src={project.exterior} alt={`${project.title} — экстерьер`} /> : <HouseVisual variant={project.accent} />}
        </section>

        <section className="detailBody">
          <div className="sectionTag">01 / VISUALS</div>
          <div className="detailVisuals">
            <div>{project.exterior ? <img className="detailMedia" src={project.exterior} alt={`${project.title} — визуализация экстерьера`} /> : <HouseVisual variant={project.accent} />}<div className="visualCaption">ВИЗУАЛИЗАЦИЯ ЭКСТЕРЬЕРА</div></div>
            <div>{project.plan ? <img className="detailPlanImage" src={project.plan} alt={`${project.title} — планировка`} /> : <div className="planInfo"><span>ПЛАНИРОВКА</span><strong>Предоставляется<br/>при запросе проекта.</strong><p>План адаптируется под участок и состав семьи после обсуждения задачи.</p></div>}<div className="visualCaption">ПЛАНИРОВКА</div></div>
          </div>
        </section>

        {project.id === 're-project-1' && (
          <section className="detailBody detailScope">
            <div className="sectionTag">02 / CONSTRUCTOR</div>
            <div className="detailContent">
              <div>
                <div className="eyebrow">АРХИТЕКТУРА-КОНСТРУКТОР</div>
                <h2>Меняется<br /><em>сценарий.</em></h2>
              </div>
              <div>
                <p className="detailLead">Это не жёсткая планировка, а архитектурная система, которую можно собирать под конкретную семью.</p>
                <div className="detailCallout"><b>Сауна и парная</b><span>Можно сохранить отдельную wellness-зону с комнатой отдыха, душевой и парной.</span></div>
                <div className="detailCallout"><b>Детские комнаты</b><span>Ту же часть дома можно перераспределить в дополнительные спальни или детские, если состав семьи этого требует.</span></div>
                <div className="detailCallout"><b>Фасад остаётся цельным</b><span>Изменения происходят внутри планировочной схемы, поэтому архитектурный образ и пропорции фасадов сохраняются органичными.</span></div>
              </div>
            </div>
          </section>
        )}

        <section className="detailBody detailScope">
          <div className="sectionTag">{project.id === 're-project-1' ? '03' : '02'} / SCOPE</div>
          <div className="detailContent">
            <div>
              <div className="eyebrow">СОСТАВ ПРОЕКТА</div>
              <h2>От архитектуры<br /><em>до интерьера.</em></h2>
            </div>
            <div>
              <ul className="featureList">{architectureOffer.sections.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <div className="detailCallout"><b>Полный цикл</b><span>{architectureOffer.supervision}</span></div>
              <div className="detailCallout"><b>Правки</b><span>{architectureOffer.revisions}.</span></div>
              <div className="detailCallout"><b>Реализация</b><span>{architectureOffer.team}</span></div>
              <Link href="/projects/request" className="dark">Обсудить проект ↗</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
