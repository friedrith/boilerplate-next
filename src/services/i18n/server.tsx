'use server'
import { headers } from 'next/headers'
import { match } from '@formatjs/intl-localematcher'
import { cookies } from 'next/headers'
import Negotiator from 'negotiator'
import {
  defaultLocale,
  defaultNamespace,
  locales,
  namespaces,
  NEXT_LOCALE,
} from './config'
import { findTranslation } from './private/findTranslation'

export async function getLocale() {
  const cookieStore = await cookies()

  if (cookieStore.has(NEXT_LOCALE)) {
    return cookieStore.get(NEXT_LOCALE)?.value ?? defaultLocale
  }

  const headersList = await headers()

  const allHeaders = [...headersList.entries()].reduce(
    (acc, [name, value]) => ({
      ...acc,
      [name]: value,
    }),
    {}
  )

  const languages = new Negotiator({ headers: allHeaders }).languages()

  try {
    return match(languages, locales, defaultLocale)
  } catch {
    return defaultLocale
  }
}

export async function changeLocale(locale: string) {
  const cookieStore = await cookies()
  cookieStore.set(NEXT_LOCALE, locale)
}

export async function getMessages(locale: string) {
  const promises = namespaces.map(async (namespace) => [
    namespace,
    (await import(`../../messages/${locale}/${namespace}.json`)).default,
  ])

  return Object.fromEntries(await Promise.all(promises))
}

export async function getTranslation(namespace?: string) {
  const locale = await getLocale()
  const messages = await getMessages(locale)

  return {
    locale,
    t: (key: string, specificNamespace?: string) => {
      return findTranslation(
        key,
        messages[specificNamespace ?? namespace ?? defaultNamespace]
      )
    },
  }
}
