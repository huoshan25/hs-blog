<script setup lang="ts">
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

/**当前日历日期*/
const calendar = ref<null | number>(null)

/**选中日期的回调*/
const handleUpdateValue = (value: number | null) => {
  if (value) {
    router.push({
      query: {
        ...route.query,
        date: dayjs(value).format('YYYY-MM-DD')
      }
    })
  } else {
    const query = { ...route.query }
    delete query.date
    router.push({ query })
  }
}

const disablePastDates = (timestamp: number) => {
  return timestamp > Date.now()
}

onMounted(() => {
  const { date } = route.query
  if (date) {
    calendar.value = new Date(date as string).getTime()
  }
})
</script>

<template>
  <div class="bg-white mt-[15px] p-none rounded-[6px]">
    <div class="p-[10px] font-size-[14px] font-600 color-#212529 border-b-solid border-#E4E6EB7F">博客日历</div>
    <div class="flex">
      <n-date-picker
          clearable
          v-model:value="calendar"
          type="date"
          :panel="true"
          format="yyyy-MM-dd"
          @update:value="handleUpdateValue"
          :is-date-disabled="disablePastDates"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>