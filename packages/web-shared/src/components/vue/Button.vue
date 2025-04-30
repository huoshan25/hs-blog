<template>
  <button
    :class="[
      'hs-button',
      `hs-button--${variant}`,
      `hs-button--${size}`,
      { 'hs-button--block': block },
      { 'hs-button--loading': loading },
      className
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="(loading || icon) && iconPosition === 'left'" :class="`hs-button__icon hs-button__icon--${iconPosition}`">
      <Icon :name="loading ? 'spinner' : icon" :spin="loading" :size="iconSize" />
    </span>
    <span v-if="$slots.default" class="hs-button__text">
      <slot></slot>
    </span>
    <span v-if="(loading || icon) && iconPosition === 'right'" :class="`hs-button__icon hs-button__icon--${iconPosition}`">
      <Icon :name="loading ? 'spinner' : icon" :spin="loading" :size="iconSize" />
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Icon } from './Icon.vue';

export default defineComponent({
  name: 'Button',
  components: {
    Icon,
  },
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'success', 'warning', 'danger', 'link'].includes(value),
    },
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    },
    icon: {
      type: String,
      default: '',
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'right'].includes(value),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const iconSize = computed(() => {
      if (props.size === 'lg') return 20;
      if (props.size === 'sm') return 14;
      return 16;
    });

    return {
      iconSize,
    };
  },
});
</script>

<style scoped>
/* 基础按钮样式将在全局CSS中定义 */
</style> 