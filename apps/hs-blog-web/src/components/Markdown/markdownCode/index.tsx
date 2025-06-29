import { defineComponent, ref } from 'vue'
import './index.css'
import { ClientOnly } from '#components' // 将样式移到单独的 CSS 文件

export const MarkdownCode = defineComponent({
  props: {
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: 'text'
    }
  },
  setup(props) {
    const isCollapsed = ref(false)
    const copyStatus = ref<'ready' | 'copied'>('ready')

    const copyCode = async () => {
      if (import.meta.client && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(props.code)
          copyStatus.value = 'copied'
          setTimeout(() => {
            copyStatus.value = 'ready'
          }, 2000)
        } catch (error) {
          console.error('复制失败:', error)
        }
      }
    }

    const toggle = () => {
      isCollapsed.value = !isCollapsed.value
    }

    return () => (
      <ClientOnly>
        <div class="code-card n-card">
          <div class="code-header">
            <div class="language-tag">{props.language.charAt(0).toUpperCase() + props.language.slice(1)}</div>
            <div class="code-actions">
              <button onClick={toggle} class="toggle-btn">
                {isCollapsed.value ? '展开' : '收起3'}
              </button>
              <button onClick={copyCode} class="copy-btn">
                {copyStatus.value === 'copied' ? '已复制' : '复制代码'}
              </button>
            </div>
          </div>
          <pre class="hljs p-[15px] my-[0px]" style={{ display: isCollapsed.value ? 'none' : 'block' }}>
            <code innerHTML={props.code}></code>
          </pre>
        </div>
      </ClientOnly>
    )
  }
})
