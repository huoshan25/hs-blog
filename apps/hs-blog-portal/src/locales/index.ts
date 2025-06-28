import * as zh from './zh'
import * as en from './en'

export const locales = {
  zh,
  en
}

export type Locale = keyof typeof locales

// 直接使用中文类型作为基础，保持字面量类型以显示中文提示
export type LocaleMessages = typeof zh

// 默认语言
export const defaultLocale: Locale = 'zh'

// 可用语言列表
export const availableLocales: Locale[] = ['zh', 'en'] 