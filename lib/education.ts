export type EducationProduct = {
  slug: string;
  num: string;
  category: string;
  title: string;
  short: string;
  description: string;
  outcome: string;
  price: string;
  format: string;
  files: string[];
  featured?: boolean;
};

export const educationProducts: EducationProduct[] = [
 { slug:'positioning-and-client-flow', num:'01', category:'КЛИЕНТЫ', title:'Позиционирование и поток клиентов', short:'Не просто позиционирование: готовая система, где видно каждого лида, следующий шаг, дедлайн и конверсию.', description:'10+ страниц практической системы потока клиента: позиционирование, квалификация, первый созвон, бриф, предложение, follow-up, задачи и метрики. В комплекте таблица воронки, квалификации, follow-up, задач и аналитики.', outcome:'После покупки у вас будет не теория о поиске клиентов, а рабочая воронка: кого вести, что спросить на первом созвоне, когда отправить бриф, как поставить follow-up и где увидеть потерянные заявки.', price:'3 900 ₽', format:'10+ стр. + 4 таблицы', files:['01_positioning_clients.pdf','template_client_flow.xlsx'], featured:true },
 { slug:'sales-and-pricing', num:'02', category:'ПРОДАЖИ', title:'Продажи и ценообразование', short:'Соберите цену из результата проекта, оформите КП и ведите клиента до оплаты без хаотичных скидок.', description:'10+ страниц по цене и продаже дизайн-услуг: калькуляция, коммерческое предложение, этапность оплаты, возражения и follow-up. В комплекте XLSX-калькулятор, структура КП и база возражений.', outcome:'Вы получите готовую основу для расчёта стоимости, коммерческого предложения и follow-up. Можно взять таблицу, подставить свои услуги и сразу использовать её в работе с новым клиентом.', price:'3 900 ₽', format:'10+ стр. + 2 таблицы', files:['02_sales_pricing.pdf','template_sales_offer.xlsx','template_client_flow.xlsx'] },
 { slug:'project-start', num:'03', category:'ПРОЕКТ', title:'Старт дизайн-проекта', short:'От первого брифа до понятного проекта: отдельные сценарии для квартиры и дома, анализ исходных данных и структура файла.', description:'10+ страниц о старте проекта: бриф и анализ для квартиры и дома, исходные данные, папки и версии, договорная логика, планировка и Archicad. В комплекте два брифа, pipeline и инструкция по настройке собственного Archicad .tpl.', outcome:'После покупки у вас будут отдельные брифы квартиры и дома, таблица старта проекта, структура папок, чеклист исходных данных и инструкция, как собрать собственный Archicad-шаблон для интерьерной практики.', price:'4 900 ₽', format:'10+ стр. + бриф + Archicad', files:['03_project_start.pdf','template_brief_house_apartment.xlsx','template_project_pipeline.xlsx','archicad_reproject_setup.pdf'] },
 { slug:'project-workflow', num:'04', category:'СИСТЕМА', title:'Рабочий процесс дизайнера', short:'Полная рабочая цепочка 01–08: от анализа до сдачи, с документацией, комплектацией, надзором и техническими контрольными точками.', description:'10+ страниц с подробным процессом 01–08: бриф и анализ, планировка, концепция, рабочая документация, комплектация, надзор, сдача и управление версиями. Включены технические правила по ГКЛ, усилениям, нишам, привязкам и настройке Archicad.', outcome:'Вы увидите, что именно должно происходить на каждом этапе и что передаётся дальше. Внутри — pipeline проекта, правила версий, состав рабочей документации, технические контрольные точки и Archicad setup.', price:'4 900 ₽', format:'10+ стр. + pipeline + Archicad', files:['04_project_workflow.pdf','template_project_pipeline.xlsx','archicad_reproject_setup.pdf'] },
 { slug:'procurement-and-budget', num:'05', category:'КОМПЛЕКТАЦИЯ', title:'Комплектация и бюджет', short:'Не список ссылок, а система: подбор → согласование → заказ → доставка → приёмка → закрытие позиции.', description:'10+ страниц о комплектации как управляемом процессе: подбор, бюджет, статусы, заказы, замены, приёмка и связь с проектом. В комплекте таблицы позиций, бюджета, заказов и замен.', outcome:'После покупки вы сможете вести каждую позицию от первого подбора до фактической приёмки, видеть отклонение бюджета, фиксировать замены и не терять сроки поставок.', price:'4 900 ₽', format:'10+ стр. + 4 таблицы', files:['05_procurement_budget.pdf','template_procurement.xlsx'] },
 { slug:'author-supervision', num:'06', category:'НАДЗОР', title:'Авторский надзор и работа с подрядчиками', short:'Практический чеклист объекта: что взять с собой, что фотографировать и что проверять до того, как работу закроют следующим слоем.', description:'10+ страниц практического надзора: инструменты выезда, фотофиксация, черновые и чистовые работы, ГКЛ и усиления, TECEprofil, привязки сантехники, стяжка и контроль этапов. В комплекте журнал выездов, инструменты, приёмка и замечания.', outcome:'Вы получите систему выезда на объект и техническую памятку: дальномер, рулетка, фотофиксация, каркасы, усиления, ниши, сантехнические привязки, стяжка и этапная приёмка. Рабочие правила re:project отделены от требований производителей.', price:'4 900 ₽', format:'10+ стр. + 4 таблицы', files:['06_author_supervision.pdf','template_supervision.xlsx'] },
 { slug:'private-house', num:'07', category:'ЧАСТНЫЙ ДОМ', title:'Проект частного дома', short:'Полная карта загородного объекта: участок, фундамент, коробка, кровля, фасады, инженерия и наружные сети.', description:'58 страниц практического альбома по частному дому: участок, дренаж, фундамент, стены, кровля, окна, фасады, инженерия, котельная, наружные сети, отделка и ИТН. Внутри — подробные контрольные точки, технические правила re:project и рабочая таблица контроля строительства дома.', outcome:'После покупки у вас будет подробный рабочий альбом по загородному объекту: от подготовки участка и фундамента до фасада, инженерии и наружных сетей, плюс таблица контроля строительства дома. Это самый объёмный материал библиотеки и отдельный инструмент для работы с частным домом.', price:'6 900 ₽', format:'58 стр. + рабочая таблица', files:['07_private_house.pdf','template_house_control.xlsx'] },
 { slug:'digital-products-and-ai', num:'08', category:'МАСШТАБИРОВАНИЕ', title:'Цифровые продукты и AI для дизайнера', short:'Как превратить собственный опыт в самостоятельные продукты, которые экономят время дизайнеру и могут продаваться отдельно.', description:'10+ страниц о создании цифровых продуктов для дизайнера: матрица продукта, упаковка кейса, контент, AI-сценарии, контроль качества и обновления.', outcome:'Вы получите систему упаковки собственных рабочих процессов в кейсы, шаблоны и AI-инструменты: от идеи продукта до структуры файла, контента и обновлений.', price:'4 900 ₽', format:'10+ стр. + методика', files:['08_digital_products_ai.pdf'] },
];

export const educationBundles = [
  {slug:'designer-start', num:'A', title:'DESIGNER START', description:'Позиционирование + продажи + старт проекта.', price:'8 900 ₽', included:['positioning-and-client-flow','sales-and-pricing','project-start']},
  {slug:'designer-system', num:'B', title:'DESIGNER SYSTEM', description:'Полная рабочая система от клиента до сдачи.', price:'15 900 ₽', included:['positioning-and-client-flow','sales-and-pricing','project-start','project-workflow','procurement-and-budget','author-supervision']},
  {slug:'house-and-scale', num:'C', title:'HOUSE / SCALE', description:'Частные дома + комплектация + цифровые продукты и AI.', price:'11 900 ₽', included:['private-house','procurement-and-budget','digital-products-and-ai']},
];

export function getEducationProduct(slug:string){return educationProducts.find(p=>p.slug===slug)}
export function getEducationBundle(slug:string){return educationBundles.find(b=>b.slug===slug)}
export function getEducationOffer(slug:string){
  const product=getEducationProduct(slug);
  if(product) return {slug:product.slug,title:product.title,amount:Number(product.price.replace(/\D/g,'')),files:product.files};
  const bundle=getEducationBundle(slug);
  if(bundle){
    const files=[...new Set(bundle.included.flatMap(id=>educationProducts.find(p=>p.slug===id)?.files||[]))];
    return {slug:bundle.slug,title:bundle.title,amount:Number(bundle.price.replace(/\D/g,'')),files};
  }
  return null;
}
