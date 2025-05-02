import {mergeConfigs, presetAttributify, presetIcons, presetUno, transformerDirectives} from 'unocss'

export default mergeConfigs([
  {
    rules: [
      [
        /^radius-(.*)$/,
        ([, d]) => ({ 'border-radius': `${d.replace(/^\[|\]$/g, '').replace(/,/g, ' ')}` }),
      ],
      [/^sp-m-(.*)$/, ([, d]) => ({ margin: `${d.replace(/^\[|\]$/g, '').replace(/,/g, ' ')}` })],
      [/^sp-p-(.*)$/, ([, d]) => ({ padding: `${d.replace(/^\[|\]$/g, '').replace(/,/g, ' ')}` })],

      [
        /^custom-border(?:-(.+))?-(\d+px)-(\w+)-(.+)$/,
        ([, direction, width, style, color]) => {
          const borderValue = `${width} ${style} ${color}`

          if (!direction) {
            return { border: borderValue }
          }

          const sides = direction.split('-')
          const result: Record<string, string> = {}
          sides.forEach((side) => {
            if (['top', 'right', 'bottom', 'left'].includes(side)) {
              result[`border-${side}`] = borderValue
            }
          })
          return result
        },
      ],
    ],
    shortcuts: [
      ['flex-center', 'flex items-center justify-center'],
      ['flex-col-center', 'flex flex-col items-center justify-center'],
    ],
    presets: [presetUno(), presetAttributify(), presetIcons()],
    transformers: [transformerDirectives()],
  },
])
