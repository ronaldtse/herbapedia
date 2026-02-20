import { createI18n } from 'vue-i18n'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales'
import en from './messages/en'
import zhHant from './messages/zh-Hant'
import zhHans from './messages/zh-Hans'

const messages = {
  'en': en,
  'zh-Hant': zhHant,
  'zh-Hans': zhHans
}

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: 'en',
  messages,
  supportedLocales: SUPPORTED_LOCALES
})

export default i18n

export { messages }
