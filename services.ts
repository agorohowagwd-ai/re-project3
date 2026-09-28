export type Service = {
  id: string;
  num: string;
  title: string;
  price: string;
  kind: 'visual' | 'consult' | 'equipment' | 'design';
  text: string;
};

export const services: Service[] = [
  { id: 'visual', num: '01', title: 'Работа над пространством онлайн', price: '2 000 ₽', kind: 'visual', text: 'Начнём работу над вашим пространством: вы загружаете материалы, дизайнер помогает сформировать решения, а AI помогает быстро прорабатывать варианты.' },
  { id: 'consult', num: '02', title: 'Онлайн-консультация специалиста', price: '3 000 ₽', kind: 'consult', text: 'Персональная консультация по интерьеру, мебели, оборудованию, свету и реализуемости решений.' },
  { id: 'equipment', num: '03', title: 'Подбор мебели и оборудования', price: '25 000 ₽', kind: 'equipment', text: 'Подбор мебели, техники, сантехники, света и оборудования под ваш интерьер, задачи и бюджет.' },
  { id: 'design', num: '04', title: 'Дизайн-проект с нуля', price: 'от 50 000 ₽', kind: 'design', text: 'Полный дизайн-проект от планировочного решения и концепции до рабочей документации и комплектации.' },
];

export const service = services[0];
export function getService(id: string) { return services.find((item) => item.id === id); }
