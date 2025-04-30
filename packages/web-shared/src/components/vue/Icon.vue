<template>
  <span v-if="!path && !spin" class="icon-not-found"></span>
  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="spin ? color : 'none'"
    :stroke="!spin ? color : 'none'"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="[className, { 'animate-spin': spin }]"
    :style="style"
  >
    <path :d="spin ? spinnerPath : path" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { iconPaths, spinnerConfig } from '../common/icons';

export default defineComponent({
  name: 'Icon',
  props: {
    name: {
      type: String,
      default: '',
    },
    size: {
      type: [Number, String],
      default: 24,
    },
    color: {
      type: String,
      default: 'currentColor',
    },
    className: {
      type: String,
      default: '',
    },
    style: {
      type: Object,
      default: () => ({}),
    },
    spin: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const path = computed(() => {
      if (props.spin) return '';
      return (iconPaths as Record<string, string>)[props.name] || '';
    });

    const spinnerPath = computed(() => {
      return spinnerConfig.path;
    });

    return {
      path,
      spinnerPath,
    };
  },
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 