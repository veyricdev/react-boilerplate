import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { useTranslation } from 'react-i18next'

import { LocalesEnum } from '~/enum'

type Locale = keyof typeof LocalesEnum
type Language = {
  locale: keyof typeof LocalesEnum
  icon: string
  label: string
}

export const LANGUAGE_MAP: Record<Locale, Language> = {
  [LocalesEnum.vi_VN]: {
    locale: LocalesEnum.vi_VN,
    label: 'Vietnamese',
    icon: 'flag-vi',
  },
  [LocalesEnum.en_US]: {
    locale: LocalesEnum.en_US,
    label: 'English',
    icon: 'flag-us',
  },
} as const

export default function useLocale() {
  const { t, i18n } = useTranslation()

  const locale = (i18n.resolvedLanguage || LocalesEnum.en_US) as Locale
  const language = LANGUAGE_MAP[locale]

  /**
   * localstorage -> i18nextLng change
   */
  const setLocale = (locale: Locale) => {
    i18n.changeLanguage(locale)
    // set lang ant dayjs
    document.documentElement.lang = locale
    dayjs.locale(locale)
  }

  return {
    t,
    locale,
    language,
    setLocale,
  }
}
