import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { LocalesEnum, StorageEnum } from '~/enum'
import Storage from '~/utils/Storage'

import en_US from './lang/en_US'
import vi_VN from './lang/vi_VN'

const defaultLng = Storage?.getStringItem(StorageEnum.I18N) || (LocalesEnum.en_US as string)

// Set the HTML lang attribute during initialization, otherwise the browser translation prompt will pop up if the system language is different from the setting
if (typeof document !== 'undefined') document.documentElement.lang = defaultLng

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: LocalesEnum.en_US,
    debug: true,
    lng: defaultLng, // localstorage -> i18nextLng: en_US

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      [LocalesEnum.en_US]: en_US,
      [LocalesEnum.vi_VN]: vi_VN,
    },
  })

export const { t } = i18n
export default i18n
