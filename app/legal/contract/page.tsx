import Header from '@/components/Header';
import Link from 'next/link';
import type { Metadata } from 'next';
import { contractItems } from '@/lib/contract';

export const metadata: Metadata = { title: 'Договор оказания услуг — re:project' };

function Marked({ text }: { text: string }) {
  return <>{text.split(/(\[[^\]]+\])/).filter(Boolean).map((part, i) => /^\[.*\]$/.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>)}</>;
}

export default function ContractPage() {
  return <>
    <Header />
    <article className="legal contractPage">
      <div className="eyebrow">LEGAL / 02</div>
      <h1>Договор<br /><em>оказания услуг.</em></h1>
      <p className="legalLead">Типовая форма договора на разработку дизайн-проекта. Данные сторон, состав этапов, сроки и стоимость заполняются индивидуально при заключении договора и фиксируются в личном кабинете или по e-mail.</p>
      <div className="contractActions">
        <a className="dark" href="/docs/dogovor-okazaniya-uslug.docx" download>Скачать договор (DOCX) ↓</a>
        <Link className="outline" href="/legal">← Все условия</Link>
      </div>
      <div className="contractPaper">
        {contractItems.map((item, i) => {
          switch (item.t) {
            case 'title': return <h2 className="cTitle" key={i}><Marked text={item.x} /></h2>;
            case 'subtitle': return <p className="cSubtitle" key={i}>{item.x}</p>;
            case 'date': return <p className="cDate" key={i}><span><Marked text={item.x} /></span><span><Marked text={item.y} /></span></p>;
            case 'h': return <h3 className="cHead" key={i}>{item.x}</h3>;
            case 'sub': return <p className="cSub" key={i}><Marked text={item.x} /></p>;
            case 'p': return <p key={i} className={item.left ? 'cLeft' : undefined}><Marked text={item.x} /></p>;
            case 'annexbreak': return <hr className="cBreak" key={i} />;
            case 'annex': return <p className="cAnnex" key={i}><Marked text={item.x} /></p>;
            case 'annextitle': return <h3 className="cHead" key={i}>{item.x}</h3>;
            case 'table': return <div className="cTableWrap" key={i}><table className="cTable"><tbody>{item.rows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => item.header && ri === 0 ? <th key={ci}>{cell}</th> : <td key={ci}>{cell.split('\n').map((line, li) => <div key={li}>{line ? <Marked text={line} /> : <>&nbsp;</>}</div>)}</td>)}</tr>)}</tbody></table></div>;
          }
        })}
      </div>
    </article>
  </>;
}
