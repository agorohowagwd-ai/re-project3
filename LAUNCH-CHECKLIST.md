# re:project v19 — запуск

## 1. Supabase
Откройте Supabase → SQL Editor и выполните `supabase-schema.sql` целиком.

Если база уже была настроена на v18, SQL безопасно использует `if not exists` / `add column if not exists` для новой части v19.

## 2. Роль владельца
После регистрации владельца выполните в Supabase:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'ВАШ_EMAIL');
```

## 3. Vercel Environment Variables
В Production добавьте:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `SBER_USERNAME`
- `SBER_PASSWORD`
- `SBER_RETURN_URL` — можно не задавать, тогда используется текущий домен сайта + `/account`
- `SBER_CALLBACK_URL` — можно не задавать, тогда используется текущий домен сайта + `/api/payment/callback`

После изменения переменных нужен новый Production Deployment.

## 4. Sber
Для реальной оплаты нужны действующие реквизиты интернет-эквайринга/платёжного шлюза Сбера. Без них сайт специально не имитирует успешную оплату.

Текущий код использует регистрацию заказа через `register.do`, получает `orderId/formUrl/deepLink`, а статус подтверждается callback или отдельной проверкой.

## 5. Education
Оплата цифрового материала создаёт запись платежа с `product_slug`.
После успешной оплаты сервер выдаёт `education_access`.
Файлы выдаются через защищённый `/api/education/download`, а не публичной ссылкой.

## 6. Что проверить перед запуском
- регистрация клиента
- вход / выход
- создание заявки
- оплата тестового заказа
- callback от Сбера
- появление `paid` в `payments`
- появление доступа в `education_access`
- скачивание DOCX/XLSX
- кабинет клиента
- `/admin` для владельца
- сообщение клиент ↔ дизайнер
- AI после оплаты
- AI не запускается без оплаченной заявки
- мобильная версия
- домен `reproject.arh.app`

## 7. Юридическая часть
Перед первым реальным коммерческим платежом заполните юридическую страницу своими реквизитами, офертой/договором, политикой обработки персональных данных, условиями возврата и правилами продажи цифровых материалов. Текущая страница — рабочий MVP-шаблон.
