<script setup lang="ts">
  const postLink = computed(() => {
    return location.protocol + '//' + location.host + location.pathname
  })

  const website = computed(() => {
    return location.protocol + '//' + location.host
  })
</script>

<template>
  <div
    class="relative border border-dashed border-[#ccc] rounded-[5px] p-[13px_16px_8px] mt-[50px] mb-[20px] font-size-[14px] w-full"
  >
    <span class="absolute left-1/2 -top-[12px] -translate-x-1/2 bg-white font-500 select-none">【END】</span>
    <p class="mb-[5px]">本文链接：{{ postLink }}</p>
    <p>
      <span>版权声明：本博客所有文章除声明转载外，均采用</span>
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0" target="_blank" class="text-[#1e80ff] mx-1">
        CC-BY-NC-SA 4.0
      </a>
      <span>许可协议。转载请注明来自</span>
      <a :href="website" class="text-[#1e80ff] ml-1">火山博客</a>
      。
    </p>
  </div>
</template>

<style scoped lang="scss"></style>
