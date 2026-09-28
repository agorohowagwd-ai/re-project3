import Header from '@/components/Header';
import RoomVisual from '@/components/RoomVisual';
import VisualizationForm from '@/components/VisualizationForm';
import ServiceRequestForm from '@/components/ServiceRequestForm';
import Link from 'next/link';
import { getService } from '@/lib/services';

export default function Service({params}:{params:{id:string}}){
  const item=getService(params.id);
  if(!item)return <div>Услуга не найдена</div>;
  return <><Header/><main>
    <section className="serviceHero"><div><a className="back" href="/#services">← Все услуги</a><div className="eyebrow">SERVICE / {item.num}</div><h1>{item.title}</h1><p>{item.text}</p><strong className="price">{item.price}</strong></div>{item.kind==='visual'?<RoomVisual kind="visual"/>:<div className="serviceAbstract"><span>{item.num}</span><b>re:project</b></div>}</section>
    {item.kind==='visual' ? <section className="visualOrder"><div className="sectionTag">01 / CREATE</div><div><div className="eyebrow">AI VISUALIZATION</div><h2>Ваше пространство.<br/><em>Новый сценарий.</em></h2><p className="sectionIntro">Загрузите фотографию интерьера, выберите стиль и добавьте несколько сообщений с пожеланиями. После загрузки фотографии появится возможность сразу запустить AI-визуализацию.</p><VisualizationForm/></div></section> : item.kind==='design' ? <section className="requestSection"><div className="sectionTag">01 / BRIEF</div><div><div className="eyebrow">DESIGN PROJECT · ОТ 50 000 ₽</div><h2>Начнём<br/><em>с брифа.</em></h2><p className="sectionIntro">Подробный бриф собирает исходные данные, образ жизни, функциональные требования, эстетику, материалы, бюджет и сроки. Выберите тип объекта — после заполнения брифа перейдёте в личный кабинет.</p><div className="briefChoice"><Link className="dark" href="/service/design/brief?type=apartment">Бриф для квартиры ↗</Link><Link className="outline" href="/service/design/brief?type=house">Бриф для дома ↗</Link></div></div></section> : <section className="requestSection"><div className="sectionTag">01 / REQUEST</div><div><div className="eyebrow">CONSULTATION</div><h2>Расскажите о задаче.</h2><p className="sectionIntro">После заявки данные сохраняются в личном кабинете.</p><ServiceRequestForm service={item}/></div></section>}
  </main></>
}
