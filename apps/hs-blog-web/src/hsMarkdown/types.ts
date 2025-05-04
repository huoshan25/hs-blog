export interface MarkdownComponent {
  name: string
  render: (str: string, lang: string) => string
}

export interface MarkdownOptions {
  html?: boolean
  linkify?: boolean
  typographer?: boolean

  [key: string]: any
}

// markdown-it 渲染器规则类型
export type RendererRule = (tokens: any[], idx: number, options: any, env: any, self: any) => string

// markdown 渲染器接口
export interface MarkdownRenderer {
  render: (content: string) => string
}