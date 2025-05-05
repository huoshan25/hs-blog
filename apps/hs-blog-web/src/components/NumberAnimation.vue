<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'

  const props = defineProps({
    /**
     * 动画起始数值
     * @default 0
     */
    from: {
      type: Number,
      default: 0
    },

    /**
     * 动画目标数值
     * @default 0
     */
    to: {
      type: Number,
      default: 0
    },

    /**
     * 动画持续时间(毫秒)
     * @default 1000
     */
    duration: {
      type: Number,
      default: 1000
    },

    /**
     * 数字精度，保留小数位
     * @default 0
     */
    precision: {
      type: Number,
      default: 0
    },

    /**
     * 数字前缀
     * @default ''
     */
    prefix: {
      type: String,
      default: ''
    },

    /**
     * 数字后缀
     * @default ''
     */
    suffix: {
      type: String,
      default: ''
    }
  });

  const displayNumber = ref(props.from)
  const isAnimating = ref(false)

  // 计算格式化后的数字
  const formattedNumber = computed(() => {
    const formattedNum = Number(displayNumber.value).toFixed(props.precision)
    return `${props.prefix}${formattedNum}${props.suffix}`
  })

  // 执行动画
  const animate = (startValue: number, endValue: number) => {
    if (isAnimating.value) return

    isAnimating.value = true
    displayNumber.value = startValue

    const startTime = Date.now()
    const difference = endValue - startValue

    const updateNumber = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime

      if (elapsed >= props.duration) {
        displayNumber.value = endValue
        isAnimating.value = false
        return
      }

      const progress = elapsed / props.duration
      const currentValue = startValue + difference * easeOutQuad(progress)
      displayNumber.value = currentValue

      requestAnimationFrame(updateNumber)
    }

    requestAnimationFrame(updateNumber)
  }

  // 缓动函数 - 二次方缓出
  const easeOutQuad = (t: number): number => {
    return t * (2 - t)
  }

  // 监听to的变化，重新开始动画
  watch(
    () => props.to,
    newValue => {
      if (newValue !== undefined && newValue !== null) {
        animate(displayNumber.value, newValue)
      }
    }
  )

  // 组件挂载时开始动画
  onMounted(() => {
    if (props.to !== undefined && props.to !== null) {
      animate(props.from, props.to)
    }
  })
</script>

<template>
  <div class="number-animation">{{ formattedNumber }}</div>
</template>

<style scoped>
  .number-animation {
    display: inline-block;
    font-weight: 500;
    color: inherit;
  }
</style>
