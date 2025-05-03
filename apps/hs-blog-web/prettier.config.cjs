/**
 * @typedef {import('prettier').Config} PrettierConfig
 * @typedef {import('prettier').PluginDescriptor} PrettierPluginDescriptor
 */

/**
 * Vue项目的Prettier配置
 * @type {PrettierConfig & { plugins: PrettierPluginDescriptor[] }}
 */
module.exports = {
  /** 每行最大宽度 @default 80 */
  printWidth: 120,

  /** 缩进空格数 @default 2 */
  tabWidth: 2,

  /** 使用空格缩进 @default false */
  useTabs: false,

  /** Vue风格指南推荐不使用分号 @default true */
  semi: false,

  /** 使用单引号 @default false */
  singleQuote: true,

  /**
   * 对象属性的引号使用
   * @default "as-needed"
   * "as-needed" - 需要时使用
   * "consistent" - 有一个需要引号，则全部使用
   * "preserve" - 保持原样
   */
  quoteProps: 'as-needed',

  /**
   * 多行时尾逗号配置
   * @default "all"
   * "all" - 尽可能使用尾逗号
   * "es5" - 在ES5中有效的地方使用
   * "none" - 不使用
   */
  trailingComma: 'none',

  /** 对象字面量括号空格 @default true */
  bracketSpacing: true,

  /** 多行HTML标签的>放在最后一行末尾 @default false */
  bracketSameLine: false,

  /**
   * 箭头函数参数括号
   * @default "always"
   * "avoid" - 可以省略括号时省略
   * "always" - 总是使用括号
   */
  arrowParens: 'avoid',

  /** 换行符类型 @default "lf" */
  endOfLine: 'lf',

  /** HTML空格敏感度 @default "css" */
  htmlWhitespaceSensitivity: 'ignore',

  /** Vue文件中的script和style标签内容是否缩进 @default false */
  vueIndentScriptAndStyle: true,

  /** HTML标签属性换行 @default false */
  singleAttributePerLine: false,

  /** 插件 */
  plugins: []
};