'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import PaymentPanel from '@/components/PaymentPanel';

type Message = { role: 'user'; text: string };

const styles = ['Minimalism', 'Japandi', 'Modern', 'Contemporary', 'Scandinavian'];

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1800;
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Не удалось обработать изображение'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = () => reject(new Error('Не удалось прочитать изображение'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Не удалось загрузить файл'));
    reader.readAsDataURL(file);
  });
}

export default function VisualizationForm() {
  const router = useRouter();
  const [image, setImage] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [style, setStyle] = useState('Minimalism');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [requestId, setRequestId] = useState('');
  const [paymentReady, setPaymentReady] = useState(false);

  const canGenerate = Boolean(image && messages.length && !loading);
  const messageCount = useMemo(() => messages.length, [messages]);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Загрузите изображение JPG, PNG или WEBP.');
      return;
    }
    try {
      setError('');
      setImage(await compressImage(file));
      setFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить изображение');
    }
  }

  function addMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { role: 'user', text }]);
    setDraft('');
    setError('');
  }

  async function generate() {
    if (!image) return setError('Сначала загрузите фотографию интерьера.');
    if (!messages.length) return setError('Добавьте хотя бы одно сообщение с пожеланиями.');
    if (requestId) return;
    setLoading(true); setError('');
    try {
      const supabase = getSupabaseBrowser(); const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) { router.push('/login?next=/service/visual'); return; }
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.session.access_token}` };
      const created = await fetch('/api/requests', { method: 'POST', headers, body: JSON.stringify({ serviceId: 'visual', serviceTitle: 'AI-визуализация интерьера', name: auth.session.user.user_metadata?.name || '', email: auth.session.user.email || '', message: messages[0]?.text || '', payload: { style, messages, fileName } }) });
      const createdJson = await created.json(); if (!created.ok) throw new Error(createdJson.error || 'Не удалось создать заявку');
      const uploaded = await fetch('/api/requests/source', { method: 'POST', headers, body: JSON.stringify({ requestId: createdJson.id, image }) });
      const uploadedJson = await uploaded.json(); if (!uploaded.ok) throw new Error(uploadedJson.error || 'Не удалось сохранить фото');
      setRequestId(createdJson.id); setPaymentReady(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Не удалось создать заявку'); }
    finally { setLoading(false); }
  }

  return (
    <div className="visualizer">
      <div className="visualLeft">
        <div className="eyebrow">01 / SOURCE IMAGE</div>
        <div className="uploadBox">
          {image ? (
            <>
              <img src={image} alt="Исходный интерьер" />
              <div className="uploadMeta"><span>{fileName}</span><label className="textButton">Заменить<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} /></label></div>
            </>
          ) : (
            <label className="uploadEmpty">
              <span className="uploadMark">+</span>
              <b>Загрузить фотографию интерьера</b>
              <small>JPG, PNG или WEBP · до 10 МБ</small>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
            </label>
          )}
        </div>

        <div className="styleBlock">
          <div className="eyebrow">02 / STYLE</div>
          <div className="styleChoices">
            {styles.map((item) => <button type="button" key={item} className={style === item ? 'styleChosen' : ''} onClick={() => setStyle(item)}>{item}</button>)}
          </div>
        </div>
      </div>

      <div className="visualRight">
        <div className="eyebrow">03 / BRIEF</div>
        <h2>Опишите,<br /><em>что изменить.</em></h2>
        <p className="visualIntro">Можно отправить несколько сообщений: сначала общую задачу, затем отдельные пожелания по мебели, материалам, свету или цвету.</p>

        <div className="messageThread">
          {messages.length === 0 && <div className="threadEmpty">Например: «Сделать интерьер спокойнее, добавить натуральное дерево и заменить диван на светлый прямой.»</div>}
          {messages.map((message, index) => <div className="message" key={`${message.text}-${index}`}><small>ЗАПРОС {String(index + 1).padStart(2, '0')}</small><p>{message.text}</p></div>)}
        </div>

        <div className="messageComposer">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') addMessage(); }} rows={4} placeholder="Что хотите изменить в интерьере?" />
          <button type="button" className="addMessage" onClick={addMessage}>Добавить сообщение ↗</button>
        </div>

        <div className="visualAction">
          <div><span>{messageCount} {messageCount === 1 ? 'сообщение' : 'сообщений'}</span><b>{style}</b></div>
          <button type="button" className="dark generateButton" disabled={!canGenerate || Boolean(requestId)} onClick={generate}>{loading ? 'Отправляем заявку…' : requestId ? 'Заявка отправлена' : 'Отправить заявку ↗'}</button>
        </div>

        {error && <div className="formError">{error}</div>}
        {paymentReady && <div className="visualPayment"><div className="eyebrow">04 / PAYMENT</div><h3>Оплатите заявку.</h3><p>Заявка и фото сохранены. После подтверждения оплаты дизайнер подготовит AI-вариант — он появится в личном кабинете, мы напишем вам в чат.</p><PaymentPanel amount={2000} description="re:project — AI-визуализация интерьера" requestId={requestId} onPaid={()=>{setPaymentReady(false);setNotice('Оплата подтверждена. Дизайнер подготовит AI-вариант — результат появится в личном кабинете.');}}/></div>}
        {notice && <div className="formSuccess">{notice}</div>}

      </div>
    </div>
  );
}
