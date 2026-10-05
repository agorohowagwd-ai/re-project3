import Link from 'next/link';
import type { Service } from '@/lib/services';

export default function ServiceCard({ service }: { service: Service }) {
  return <Link href={`/service/${service.id}`} className="serviceCard">
    <div className="serviceCardTop"><small>{service.num}</small><strong>{service.price}</strong></div>
    <h3>{service.title}</h3><p>{service.text}</p><div className="more">Открыть услугу <b><span className="arrowIcon"></span></b></div>
  </Link>;
}
