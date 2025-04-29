/**
 * @typedef {import("prettier").Config} PrettierConfig
 * @typedef {import("prettier").PluginDescriptor} PrettierPluginDescriptor
 */
/**
 * NestJS项目的Prettier配置
 * @type {PrettierConfig & { plugins: PrettierPluginDescriptor[] }}
 */
module.exports = {
  /** 每行最大宽度 @default 80 */
  printWidth: 100,

  /** 缩进空格数 @default 2 */
  tabWidth: 2,

  /** 使用空格缩进 @default false */
  useTabs: false,

  /** NestJS风格指南推荐使用分号 @default true */
  semi: true,

  /** 使用单引号 @default false */
  singleQuote: true,

  /**
   * 对象属性的引号使用
   * @default "as-needed"
   * "as-needed" - 需要时使用
   * "consistent" - 有一个需要引号，则全部使用
   * "preserve" - 保持原样
   */
  quoteProps: "as-needed",

  /**
   * 多行时尾逗号配置
   * @default "all"
   * "all" - 尽可能使用尾逗号
   * "es5" - 在ES5中有效的地方使用
   * "none" - 不使用
   */
  trailingComma: "all",

  /** 对象字面量括号空格 @default true */
  bracketSpacing: true,

  /** TypeScript类型定义的括号空格 @default false */
  bracketSameLine: false,

  /**
   * 箭头函数参数括号
   * @default "always"
   * "avoid" - 可以省略括号时省略
   * "always" - 总是使用括号
   */
  arrowParens: "always",

  /** 换行符类型 @default "lf" */
  endOfLine: "lf",

  /** 解析器 */
  parser: "typescript",

  /** 插件 */
  plugins: [
    "@trivago/prettier-plugin-sort-imports", // import排序
    "prettier-plugin-organize-imports"
  ],

  /** Import排序配置 */
  importOrder: [
    "^@nestjs/(.*)$", // NestJS相关包
    "^@core/(.*)$",   // 核心模块
    "^@common/(.*)$", // 公共模块
    "^@config/(.*)$", // 配置
    "^@modules/(.*)$", // 业务模块
    "^[./]", // 相对路径导入
    "^[@/]" // src目录路径别名
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
};