# re:project MVP v18

Production-ready MVP for re:project architecture / interior design studio.

## Stack
- Next.js App Router
- React
- Supabase Auth / Database / Storage
- OpenAI image generation API for paid AI visualization flow
- SberPay/SBP integration when merchant credentials are configured

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## Environment
Copy `.env.example` to `.env.local` and fill the required Supabase/OpenAI/Sber values.
Never commit `.env.local` or secret keys.

## Important flow
1. Client registers / logs in.
2. Client uploads an interior image and describes the task.
3. A request is created without consuming AI resources.
4. Payment is requested.
5. AI generation starts only after the payment callback / confirmed payment.
6. Result is saved to the client's account.

## GitHub
The project root is this directory itself. `app/`, `components/`, `lib/`, `public/` and `package.json` are intentionally at repository root so Vercel detects the Next.js App Router correctly.
