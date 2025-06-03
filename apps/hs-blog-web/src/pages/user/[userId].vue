<script setup lang="ts">
  import { getUser } from '@/api/user'
  import { useTimeFormat } from '~/composables/useTimeFormat'
  import position from '~/components/Icon/Position.vue'
  import { HttpStatus } from '~/enums/httpStatus'

  const route = useRoute()

  const { data: user, error } = await useAsyncData('user', () => getUser({ id: route.params.userId as string }))
  if (error.value) {
    showError({ statusCode: HttpStatus.NOT_FOUND, message: '未找到该用户' })
  }
</script>

<template>
  <div class="flex justify-center mt-[16px] w-full max-w-[960px] mx-auto">
    <div class="w-full">
      <div class="flex p-[30px] bg-white radius-[4px]">
        <nuxt-img
          :src="user?.data.avatar"
          class="w-[90px] h-[90px] radius-[50%] mr-[2.4rem] cursor-pointer"
          alt="avatar"
        />
        <div class="flex flex-col">
          <div class="text-[20px] font-600">{{ user?.data.userName }}</div>
          <div class="c-#1e80ff font-700 text-[12px]">
            {{ user?.data.level }}
          </div>
          <div class="mt-[8px] flex justify-between items-center">
            <div class="mr-[8px] flex items-center">
              <n-icon size="20">
                <position />
              </n-icon>
            </div>
            <div class="c-#72777b">
              {{ user?.data.position }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-[20rem] ml-[1rem] radius-[4px]">
      <div class="flex justify-between text-[15px] pb-[1.25rem] px-[0.147rem]">
        <div>加入于</div>
        <div>{{ useTimeFormat(user!.data.createdAt).split(' ')[0] }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
