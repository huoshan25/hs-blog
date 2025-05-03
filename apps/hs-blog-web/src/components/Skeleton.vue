<script setup lang="ts">
  import type { StyleValue } from 'vue'

  interface Props {
    text?: boolean
    width?: string | number
    height?: string | number
    size?: 'small' | 'medium' | 'large'
    repeat?: number
    round?: boolean
    circle?: boolean
    animated?: boolean
    style?: StyleValue
  }

  withDefaults(defineProps<Props>(), {
    text: false,
    width: '100%',
    height: undefined,
    size: 'medium',
    repeat: 1,
    round: false,
    circle: false,
    animated: true,
    style: undefined
  })
</script>

<template>
  <div
    class="w-skeleton"
    :class="{
      'w-skeleton--animated': animated,
      'w-skeleton--text': text,
      'w-skeleton--round': round,
      'w-skeleton--circle': circle,
      [`w-skeleton--${size}`]: size
    }"
    :style="style"
  >
    <template v-if="text">
      <div
        v-for="i in repeat"
        :key="i"
        class="w-skeleton__text"
        :style="{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height
        }"
      ></div>
    </template>
    <div
      v-else
      class="w-skeleton__block"
      :style="{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }"
    ></div>
  </div>
</template>

<style scoped>
  .w-skeleton {
    display: inline-flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    margin: 5px;
  }

  .w-skeleton__text,
  .w-skeleton__block {
    background-color: rgba(0, 0, 0, 0.06);
    border-radius: 3px;
  }

  .w-skeleton--round .w-skeleton__text,
  .w-skeleton--round .w-skeleton__block {
    border-radius: 999px;
  }

  .w-skeleton--circle .w-skeleton__block {
    border-radius: 50%;
  }

  /*大小变异*/
  .w-skeleton--small .w-skeleton__text {
    height: 16px;
  }

  .w-skeleton--medium .w-skeleton__text {
    height: 20px;
  }

  .w-skeleton--large .w-skeleton__text {
    height: 24px;
  }

  /* Animation */
  .w-skeleton--animated .w-skeleton__text,
  .w-skeleton--animated .w-skeleton__block {
    position: relative;
    overflow: hidden;
  }

  .w-skeleton--animated .w-skeleton__text::after,
  .w-skeleton--animated .w-skeleton__block::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: skeleton-loading 1.4s ease infinite;
  }

  @keyframes skeleton-loading {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  /*黑暗的模式*/
  @media (prefers-color-scheme: dark) {
    .w-skeleton__text,
    .w-skeleton__block {
      background-color: rgba(255, 255, 255, 0.09);
    }
  }
</style>
