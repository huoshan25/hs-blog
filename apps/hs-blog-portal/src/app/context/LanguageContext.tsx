'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { locales, type Locale, type LocaleMessages, defaultLocale } from '@/locales'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: LocaleMessages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  // 从localStorage读取语言设置
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && locales[savedLocale]) {
      setLocale(savedLocale)
    }
  }, [])

  // 保存语言设置到localStorage
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const contextValue: LanguageContextType = {
    locale,
    setLocale: handleSetLocale,
    t: locales[locale] as LocaleMessages
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}