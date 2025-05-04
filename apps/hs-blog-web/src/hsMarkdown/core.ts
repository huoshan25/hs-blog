import MarkdownIt from 'markdown-it'
import 'highlight.js/styles/vs2015.css'
import type { MarkdownComponent, MarkdownOptions, RendererRule, MarkdownRenderer } from './types'
import { codeBlock } from "~/hsMarkdown/components/codeBlock"

export class MarkdownExtension {
  private readonly md: MarkdownIt
  private components: Map<string, MarkdownComponent> = new Map()

  constructor(options: MarkdownOptions = {}) {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      ...options,
    })

    // 重写围栏代码块渲染器
    this.md.renderer.rules.fence = ((tokens: any[], idx: number, options: any, env: any, self: any): string => {
      const token = tokens[idx]
      const codeBlockComponent = this.components.get('code-block')
      if (codeBlockComponent) {
        return codeBlockComponent.render(token.content, token.info)
      }
      return `<pre><code>${token.content}</code></pre>`
    }) as RendererRule


    // 重写普通代码块渲染器
    this.md.renderer.rules.code_block = ((tokens: any[], idx: number, options: any, env: any, self: any): string => {
      const token = tokens[idx]
      return this.components.get('code-block')?.render(token.content, '') || token.content
    }) as RendererRule

    this.registerDefaultComponents()
  }

  registerComponent(component: MarkdownComponent): void {
    this.components.set(component.name, component)
  }

  private registerDefaultComponents(): void {
    this.registerComponent(codeBlock)
  }

  getInstance(): MarkdownRenderer {
    return {
      render: (content: string): string => {
        const html = this.md.render(content)
        // 处理代码块
        return html.replace(
          /<!--CODE_BLOCK_START (\w+)-->([\s\S]*?)<!--CODE_BLOCK_END-->/g,
          (_match: string, lang: string, code: string): string => 
            this.components.get('code-block')?.render(code, lang) || code
        )
      }
    }
  }
}