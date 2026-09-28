import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
export const metadata: Metadata={title:'re:project — архитектура · дизайн · образование',description:'Авторский сервис архитектора и дизайнера. Практические инструменты для дизайнеров.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}<Analytics/><SpeedInsights/></body></html>}
