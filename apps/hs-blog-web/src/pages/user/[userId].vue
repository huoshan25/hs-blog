<script setup lang="ts">
  import { getUser } from '@/api/user'
  import { HttpStatus } from '~/enums/httpStatus'
  import {useTimeFormat} from "~/composables/useTimeFormat";

  const route = useRoute()

  const { data: user, error } = await useAsyncData('user', () => getUser({ id: route.params.userId as string }))
  if (error.value) {
    showError({ statusCode: HttpStatus.NOT_FOUND, message: '未找到该用户' })
  }
</script>

<template>
  <div class="flex justify-center mt-[16px] w-full max-w-[960px] mx-auto">
    <ClientOnly>
      <div class="flex p-[30px] bg-white w-full radius-[4px]">
        <nuxt-img
          :src="user?.data.avatar"
          class="w-[90px] h-[90px] radius-[50%] mr-[2.4rem] cursor-pointer"
          alt="avatar"
        />
        <div class="text-[20px] font-600">{{ user?.data.userName }}</div>
      </div>
    </ClientOnly>
    <div class="w-[20rem] ml-[1rem] radius-[4px]">
      <div class="flex justify-between text-[1.25rem] pb-[1.25rem] px-[0.147rem]">
        <div>加入于</div>
        <div>{{ useTimeFormat(user!.data.createdAt).split(' ')[0] }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
