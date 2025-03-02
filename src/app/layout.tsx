import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import type { Metadata } from 'next'
import { getLocale, getMessages, TranslationProvider } from '@/services/i18n'
import { AnalyticsScript } from '@/services/analytics'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export interface LocaleLayoutProps {
  children: React.ReactNode
}

export default async function LocaleLayout({ children }: LocaleLayoutProps) {
  const locale = await getLocale()
  const messages = await getMessages(locale)

  return (
    <html lang={locale} className="dark">
      <head>
        <AnalyticsScript />
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <TranslationProvider
          locale={locale}
          messages={messages}
          defaultNamespace="common"
        >
          {children}
        </TranslationProvider>
      </body>
    </html>
  )
}
