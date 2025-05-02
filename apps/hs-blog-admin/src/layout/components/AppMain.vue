<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-transform" mode="out-in">
      <div>
        <component :is="Component" :key="route.path" />
      </div>
    </transition>
  </router-view>
</template>

<style lang="scss" scoped></style>
