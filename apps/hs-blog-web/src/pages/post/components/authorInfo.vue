<script setup lang="ts">
import { EyeOutline, TimeOutline } from "@vicons/ionicons5";
import type { ArticleDetails } from "~/api/post/type";

const props = defineProps<{
  articleData: ArticleDetails;
}>();

/*发布时间*/
const getPublishTime = (time: string) => {
  return time ? useTimeFormat(time).split(" ")[0] : "";
};

/*阅读时间*/
const readingTime = useReadingTime(props.articleData.content).minutes;
</script>

<template>
  <div class="color-#8a919f flex items-center mt-[20px]">
    <div class="mr-[15px]">{{ getPublishTime(props.articleData.publish_time) }}</div>
    <n-icon :component="EyeOutline" class="mr-[5px]" />
    <span class="mr-[15px]">{{ articleData.view_count}}</span>
    <n-icon :component="TimeOutline" class="mr-[5px]" />
    <span>阅读时间{{ readingTime }}分钟</span>
  </div>
</template>

<style scoped lang="scss"></style>
