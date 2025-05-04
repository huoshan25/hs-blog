<script setup lang="ts">
import { HttpStatus } from "~/enums/httpStatus";
import { getArticleQuery } from "~/api/search";

const entryInfo = ref();
const route = useRoute();
const router = useRouter();
/**文章列表骨架屏*/
const entryListSkeleton = ref(false);

const loading = ref(false);

/**文章详情*/
const goDetails = (id: number) => {
  navigateTo(`/post/${id}`);
};

const getArticleList = async () => {
  try {
    loading.value = true;
    entryListSkeleton.value = true;
    const params = {
      ...route.query
    };
    const res = await getArticleQuery(params);
    if (res.code === HttpStatus.OK) {
      entryInfo.value = res.data;
    }
    entryListSkeleton.value = false;
  } finally {
    loading.value = false;
  }
};

/*对应分类*/
const goCategory = (alias: string) => {
  router.push({ path: `/${alias}` });
};

/*标签页*/
const goTabs = (tab: string) => {
  router.push({ path: `/tag/${tab}` });
};

watch(() => route.query, getArticleList, { deep: true });
onMounted(() => {
  if (!entryInfo.value) {
    getArticleList();
  }
});
</script>

<template>
  <div class="entry-list-wrap">
    <div>
      <n-space v-show="entryListSkeleton" p15 vertical>
        <n-skeleton height="15px" width="40%" />
        <n-skeleton height="15px" width="100%" />
        <n-skeleton height="15px" width="70%" />
        <n-skeleton height="15px" width="50%" />
      </n-space>
      <div
        v-show="!entryListSkeleton"
        class="entry-list"
        v-for="item in entryInfo"
        :key="item.id + 'article'"
        @click="goDetails(item.id)"
      >
        <div class="flex mb-[5px] color-#b2bac2">
          <div class="comma hover:color-blue" @click.stop="goCategory(item.category_alias)">
            {{ item.category_name }}
          </div>
          <span class="comma">{{ formatRelativeTime(item.publish_time) }}</span>
          <template v-if="item.tags && item.tags.length">
            <span
              v-for="(tag, index) in item.tags"
              :key="tag + 'tag'"
              class="inline-block hover:color-blue"
              @click.stop="goTabs(tag)"
            >
              {{ tag }}
              <span v-if="index !== item.tags.length - 1" class="color-#b2bac2 m-0 mx-[0.3em]">/</span>
            </span>
          </template>
        </div>
        <n-ellipsis class="entry-list-title" :tooltip="false" v-html="item.title_highlight" />
        <n-ellipsis class="entry-list-content" :tooltip="false" v-html="item.content_highlight" />
      </div>
    </div>

    <no-more-data-divider :hasMore="loading" />
  </div>
</template>

<style scoped lang="scss">
.entry-list-wrap {
  flex-grow: 1;
  border-radius: 0 6px 6px 6px;
  box-shadow: 0 6px 10px 0 rgba(234, 234, 234, 0.8);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

:deep(em) {
  color: red;
  font-style: normal;
  margin: 0.2em;
}

.comma {
  &:after {
    content: "·";
    margin: 0 0.4em;
    color: #b2bac2;
  }

  &:last-child:after {
    content: none;
  }
}

/*类目模块*/
.entry-list {
  cursor: pointer;
  padding: 17px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid #e4e6eb7f;

  &:hover {
    background-color: #f7f8fa;
  }

  &:nth-last-child(2) {
    border-bottom: none;
  }

  &-title {
    font-weight: 600;
    font-size: 1.2rem;
    line-height: 1.2;
    width: 100%;
    margin-bottom: 5px;
    unicode-bidi: isolate;
  }

  &-content {
    color: black;
    width: 100%;
    margin-bottom: 4px;
  }
}
</style>
