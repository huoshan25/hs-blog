import { useStorage } from '@vueuse/core'
import type { GlobalThemeOverrides } from 'naive-ui'
import { generate } from '@ant-design/colors'

export const useThemeOverrides = () => {
  const themeColor = useStorage('theme-color', '#409eff')

  /*计算主题覆盖配置*/
  const themeOverrides = computed<GlobalThemeOverrides>(() => {
    const generateColors = generate(themeColor.value)
    return {
      common: {
        primaryColor: generateColors[5],
        primaryColorHover: generateColors[4],
        primaryColorSuppl: generateColors[4],
        primaryColorPressed: generateColors[6]
      },
      Button: {
        buttonColor: generateColors[5],
        buttonColorHover: generateColors[4],
        buttonColorSuppl: generateColors[4],
        buttonColorPressed: generateColors[6]
      }
    }
  })

  /**
   * 更新主题色的方法
   * @param color 颜色值
   */
  const updateThemeColor = (color: string) => {
    themeColor.value = color
  }

  return {
    themeColor,
    themeOverrides,
    updateThemeColor
  }
}