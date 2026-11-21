import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Motion from '@/components/Motion';
const manrope = Manrope({ subsets: ['latin', 'cyrillic'], weight: ['300', '400', '500', '600', '700'], variable: '--font-manrope', display: 'swap' });
export const metadata: Metadata={title:'re:project — архитектура · дизайн · образование',description:'Авторский сервис архитектора и дизайнера. Практические инструменты для дизайнеров.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru" className={manrope.variable}><body><Motion/>{children}<Analytics/><SpeedInsights/></body></html>}
