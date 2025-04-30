<template>
  <div :class="['hs-alert', `hs-alert--${type}`, className]" :style="style" role="alert">
    <div v-if="showIcon" class="hs-alert__icon">
      <Icon :name="iconName" :size="16" />
    </div>
    <div class="hs-alert__content">
      <div v-if="title" class="hs-alert__title">{{ title }}</div>
      <div class="hs-alert__message">{{ message }}</div>
    </div>
    <button 
      v-if="closable" 
      class="hs-alert__close" 
      @click="handleClose"
      aria-label="Close"
    >
      <Icon name="close" :size="14" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Icon } from './Icon.vue';

type AlertType = 'info' | 'success' | 'warning' | 'error';

export default defineComponent({
  name: 'Alert',
  components: {
    Icon,
  },
  props: {
    type: {
      type: String as () => AlertType,
      default: 'info',
      validator: (value: string) => ['info', 'success', 'warning', 'error'].includes(value),
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    closable: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: '',
    },
    style: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    // 图标映射
    const iconMap = {
      info: 'info',
      success: 'check',
      warning: 'warning',
      error: 'close',
    };
    
    // 选择对应的图标
    const iconName = computed(() => iconMap[props.type as AlertType]);
    
    // 关闭事件处理
    const handleClose = () => {
      emit('close');
    };
    
    return {
      iconName,
      handleClose,
    };
  },
});
</script>

<style scoped>
/* 基础警告提示样式将在全局CSS中定义 */
</style> 