<script setup lang="ts">
import {getTagsQuery, type TagsList} from "~/api/tag";
import {HttpStatus} from "~/enums/httpStatus";

const route = useRoute()
const tagsList = ref<TagsList[]>([])

const loading = ref(false)

const getTagsList = async () => {
  try {
    loading.value = true
    const res = await getTagsQuery({keyword: route.query.keyword as string})
    if (res.code === HttpStatus.OK) {
      tagsList.value = res.data
    }
  } finally {
    loading.value = false
  }
}
watch(() => route.query, getTagsList, {deep: true});
onMounted(() => {
  if(tagsList.value.length === 0) {
    getTagsList()
  }
})
</script>

<template>
  <div class="flex flex-col bg-white w-[100%] min-h-[100vh]">
    <div class="flex p-[20px] custom-border-bottom-1px-solid-#E4E6EB7F hover:bg-#F7F8FA cursor-pointer" v-for="tag in tagsList" :key="tag.id">
      <img class="w-[40px] h-[40px]" src="~/assets/images/tag.png" alt="标签图片">
      <div class="flex flex-1 flex-col ml-[10px]">
        <div v-html="tag.name"></div>
        <div>{{ tag.articleCount }}  文章</div>
      </div>
    </div>

    <no-more-data-divider :hasMore="loading"/>
  </div>
</template>

<style scoped lang="scss">
:deep(em) {
  color: red;
  font-style: normal;
  margin: 0.2em;
}
</style>