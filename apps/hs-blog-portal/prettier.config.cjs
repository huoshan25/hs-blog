/** @type {import('prettier').Config} */
module.exports = {
  // 基础配置
  printWidth: 100, // 每行代码最大长度
  tabWidth: 2, // 缩进宽度
  useTabs: false, // 使用空格而不是tab缩进
  semi: false, // 去掉代码尾部的分号
  singleQuote: true, // 使用单引号
  quoteProps: 'as-needed', // 对象属性只在需要时加引号

  // JSX相关
  jsxSingleQuote: false, // JSX中使用双引号
  jsxBracketSameLine: false, // JSX标签的反尖括号需要换行
  bracketSpacing: true, // 对象字面量的大括号内打印空格

  // 尾随逗号设置
  trailingComma: 'es5', // 在ES5中有效的尾随逗号（数组、对象等）

  // 箭头函数
  arrowParens: 'always', // 箭头函数总是使用括号，例如 (x) => x

  // 空格敏感度
  htmlWhitespaceSensitivity: 'css', // 根据CSS display属性处理HTML空格敏感度

  // 换行设置
  endOfLine: 'lf', // 使用 \n 作为换行符

  // Vue相关
  vueIndentScriptAndStyle: false, // 不对Vue文件中的script和style标签进行缩进

  // 嵌入式语言格式化
  embeddedLanguageFormatting: 'auto', // 格式化嵌入的代码块

  // React特定配置
  bracketSameLine: false, // 将多行JSX元素的>放在最后一行的末尾，而不是单独放在下一行

  // TypeScript相关
  importOrder: ['^@core/(.*)$', '^@server/(.*)$', '^@ui/(.*)$', '^[./]'], // 导入排序
  importOrderSeparation: true, // 不同组的导入之间添加空行

  // Markdown相关
  proseWrap: 'preserve', // Markdown文本换行方式保持原样

  // 覆盖特定文件的配置
  overrides: [
    {
      files: '*.{css,scss,less}',
      options: {
        singleQuote: false, // CSS文件使用双引号
      },
    },
    {
      files: '*.md',
      options: {
        tabWidth: 2, // Markdown文件使用2空格缩进
      },
    },
  ],
}