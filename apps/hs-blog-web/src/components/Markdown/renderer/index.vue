<script setup lang="ts">
  import { MarkdownExtension } from '~/hsMarkdown/core'

  const props = defineProps({
    markdown: {
      type: String,
      required: true
    }
  })

  const markdownExt = new MarkdownExtension()

  const renderedContent = computed(() => {
    if (!props.markdown) return ''

    let content = markdownExt.getInstance().render(props.markdown)
    let headingIndex = 0

    // 处理标题的锚点
    return content.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, text) => {
      const id = `heading-${headingIndex++}`
      return `<h${level} id="${id}">${text}<a class="header-anchor" href="#${id}"></a></h${level}>`
    })
  })
</script>

<template>
  <div class="markdown-body px-[15px]" v-html="renderedContent"></div>
</template>

<style></style>
