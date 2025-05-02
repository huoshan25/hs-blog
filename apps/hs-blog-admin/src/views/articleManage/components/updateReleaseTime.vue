<script setup lang="ts">
const timestamp = ref()
</script>

<template>
  <n-date-picker class="cursor-pointer" v-model:value="timestamp" type="datetime" clearable />
</template>

<style scoped lang="scss">

</style>