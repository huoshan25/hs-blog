import {ref, onMounted, onUnmounted, computed, type Ref} from 'vue'

// 滚动状态
interface ScrollState {
  /*当前滚动位置*/
  y: number
  /* 上一次滚动位置*/
  lastY: number
  /*滚动方向*/
  direction: 'up' | 'down' | null
}

export const useScrollWatcher = () => {
  /*当前滚动位置*/
  const scrollY = ref(0)
  /*上一次滚动位置*/
  const lastScrollY = ref(0)
  /*滚动向方*/
  const scrollDirection = ref<'up' | 'down' | null>(null)

  /*滚动事件*/
  const handleScroll = () => {
    const currentScrollY = window.scrollY

    scrollY.value = currentScrollY
    // 根据当前滚动位置和上一次滚动位置确定滚动方向
    scrollDirection.value = currentScrollY > lastScrollY.value ? 'down' : 'up'
    lastScrollY.value = currentScrollY
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, {passive: true})
    handleScroll() // 初始化值
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  /*获取完整的滚动状态*/
  const getScrollState = (): ScrollState => ({
    y: scrollY.value,
    lastY: lastScrollY.value,
    direction: scrollDirection.value,
  })

  /*检查是否超过指定阈值*/
  const isOverThreshold = (threshold: number): Ref<boolean> => {
    return computed(() => scrollY.value > threshold)
  }

  return {
    scrollY,
    lastScrollY,
    scrollDirection,
    getScrollState,
    isOverThreshold,
  }
}