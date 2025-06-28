import { useLanguage } from '@/app/context/LanguageContext'

/** 获取翻译对象 */
export function useT() {
  const { t } = useLanguage()
  return t
}

/** 获取导航栏翻译 */
export function useNavbarTranslation() {
  const t = useT()
  return t.navbar
}

/** 获取首页页面翻译 */
export function useHomepageTranslation() {
  const t = useT()
  return t.homepage
}

/** 获取日常页面翻译 */
export function useDailyTranslation() {
  const t = useT()
  return t.daily
}



