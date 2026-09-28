export type ArchitectureProject = {
  id: string;
  number: string;
  title: string;
  area: string;
  floors: string;
  bedrooms: string;
  description: string;
  features: string[];
  accent: string;
  exterior?: string;
  plan?: string;
  typeLabel?: string;
};

export const architectureProjects: ArchitectureProject[] = [
  {
    id: 're-project-1',
    number: '01',
    title: 're:project 1',
    area: '141 м²',
    floors: '1 этаж',
    bedrooms: '2 спальни',
    typeLabel: 'ТИПОВОЙ ПРОЕКТ · КОНСТРУКТОР',
    description: 'Проект-конструктор, проверенный реализацией: по этому проекту уже возведено более пяти домов. Планировка собирается под образ жизни семьи — без изменения архитектурного образа дома.',
    features: ['архитектура', 'конструктив', 'проект электрики', 'проект водоснабжения', 'готовый интерьер', 'адаптация планировки'],
    accent: 'north',
    exterior: '/projects/re-project-1/exterior.png',
    plan: '/projects/re-project-1/plan.jpg',
  },
  {
    id: 're-project-2',
    number: '02',
    title: 're:project 2',
    area: '—',
    floors: '1 этаж',
    bedrooms: '2 детские',
    typeLabel: 'ТИПОВОЙ ПРОЕКТ · СЕМЕЙНЫЙ',
    description: 'Современный одноэтажный дом для семьи с двумя детьми. Планировочная структура разделена на три самостоятельных функциональных блока: приватную зону родителей, центральное общественное пространство и детскую часть. В центре — кухня-гостиная, объединяющая повседневные сценарии и формирующая общую семейную зону.',
    features: ['архитектура', 'конструктив', 'проект электрики', 'проект водоснабжения', 'готовый интерьер', 'адаптация под заказчика'],
    accent: 'line',
    exterior: '/projects/re-project-2/exterior.png',
    plan: '/projects/re-project-2/plan.jpg',
  },
  {
    id: 're-project-3',
    number: '03',
    title: 're:project 3',
    area: '—',
    floors: '—',
    bedrooms: '—',
    typeLabel: 'ТИПОВОЙ ПРОЕКТ',
    description: 'Одноэтажный загородный дом в тёмной вертикальной обшивке с выразительной двускатной кровлей, панорамным остеклением и крытой террасой. Архитектура собрана вокруг спокойного сценария жизни в природном окружении: большие окна связывают интерьер с садом, а глубокая терраса становится продолжением жилого пространства.',
    features: ['архитектура', 'конструктив', 'проект электрики', 'проект водоснабжения', 'готовый интерьер', 'авторский надзор'],
    accent: 'courtyard',
    exterior: '/projects/re-project-3/exterior.png',
  },
];

export const architectureOffer = {
  price: '200 000 ₽',
  scope: 'Готовый проект от 0 до чистовой отделки с готовым интерьером.',
  revisions: '5 правок в проект на всех этапах проектирования',
  team: 'Работаем только с проверенными бригадами и поставщиками.',
  supervision: 'Вовлеченность на всех этапах и авторский надзор.',
  sections: ['архитектура', 'конструктив', 'проект электрики', 'проект водоснабжения', 'готовый интерьер'],
};

export function getArchitectureProject(id: string) {
  return architectureProjects.find((project) => project.id === id);
}
