import mitt from 'mitt'

type ApplicationEvents = {
  /**
   * 搜索框聚焦状态改变
   */
  'search-focus-change': boolean
}

export default defineNuxtPlugin(() => {
  const emitter = mitt<ApplicationEvents>()

  return {
    provide: {
      /**
       * 触发事件方法
       */
      emit: emitter.emit,
      /**
       * 监听事件方法
       */
      on: emitter.on,
      /**
       * 移除事件监听方法
       */
      off: emitter.off
    }
  }
}) 