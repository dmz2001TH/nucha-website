'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { th } from './translations/th'
import { en } from './translations/en'

type Language = 'th' | 'en'
type Translations = typeof th

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const translations: Record<Language, Translations> = { th, en }

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'th'
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang === 'th' || savedLang === 'en') return savedLang
    const browserLang = navigator.language.split('-')[0]
    if (browserLang === 'en') return 'en'
    return 'th'
  })

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
  }, [])

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function useTranslation() {
  const { t } = useLanguage()
  return { t }
}
