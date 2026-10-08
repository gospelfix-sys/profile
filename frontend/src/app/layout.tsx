import type { Metadata } from 'next'
import Script from 'next/script'
// Tailwind preflight(globals.css)가 먼저, 기존 디자인(profile.css)이 나중에 와야
// 같은 element 선택자(body 등) 충돌 시 기존 디자인이 이긴다.
import './globals.css'
import '@/styles/profile.css'
import { Toaster } from '@/components/ui/sonner'
import { SITE_URL } from '@/lib/site-config'

const OG_IMAGE_URL = `${SITE_URL}/images/gospelfix.jpg`
const TITLE = '소윤호 | GospelFix 대표 - AI AGENT 자동화 솔루션'
const DESCRIPTION =
  '소윤호 - GospelFix(가스펄픽스) 대표. 당신의 비즈니스를 위한 차세대 AI AGENT 자동화 솔루션'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['소윤호', 'GospelFix', '가스펄픽스', '웹 개발', '프리미엄 웹 솔루션', '프론트엔드', '웹 디자인'],
  authors: [{ name: '소윤호' }],
  robots: 'index, follow',
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'GospelFix',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'ko_KR',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
  icons: {
    icon: [
      { url: '/images/favicon.ico' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/images/apple-touch-icon.png',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f4f5f7',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster position="bottom-center" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B8HHTC2RFX"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B8HHTC2RFX');
          `}
        </Script>
      </body>
    </html>
  )
}
