<script setup lang="ts">
import {EyeOutline, ThumbsUpOutline} from "@vicons/ionicons5";

const props = defineProps({
  articleList: {
    type: Object,
    default() {
      return {};
    },
  },
});
const route = useRoute()
const router = useRouter()

interface EntryInfo {
  id: number;
  title: string;
  content: string;
  category_name: string;
  tags: { id: number; name: string }[];
}

/**文章列表骨架屏*/
const entryListSkeleton = ref(false)

const numberOfLikes = ref(22)

/*对应分类*/
const goCategory = (alias: string) => {
  router.push({path: `/blog/${alias}`})
}

/**文章详情*/
const goDetails = (id: number) => {
  navigateTo(`/blog/post/${id}`)
}

/*标签页*/
const goTabs = (tab: string) => {
  navigateTo(`/blog/tag/${tab}`)
}

onMounted(() => {
})
</script>

<template>
  <div class="entry-list-wrap">
    <n-space v-show="entryListSkeleton" p15 vertical>
      <n-skeleton height="15px" width="40%"/>
      <n-skeleton height="15px" width="100%"/>
      <n-skeleton height="15px" width="70%"/>
      <n-skeleton height="15px" width="50%"/>
    </n-space>
    <div v-show="!entryListSkeleton" class="entry-list" v-for="item in props.articleList" :key="item.id + 'article'"
         @click="goDetails(item.id)">
      <n-ellipsis class="entry-list-title" :tooltip="false">
        {{ item.title }}
      </n-ellipsis>
      <n-ellipsis class="entry-list-content" :tooltip="false">
        {{ item.description }}
      </n-ellipsis>
      <div class="entry-list-bottom">
        <div class="entry-list-bottom-left">
          <span @click.stop="goCategory(item.category_info.alias)" class="hover:color-blue">
            {{ item.category_info.name }}
          </span>
          <n-divider vertical/>
          {{ formatRelativeTime(item.publish_time) }}
          <n-divider vertical/>
          <div class="entry-list-bottom-left-item">
            <n-icon size="15" style="margin-right: 4px" color="#8a919f" :component="EyeOutline"/>
            {{ item.view_count }}
          </div>
<!--          <div style="margin-left: 15px" class="entry-list-bottom-left-item">-->
<!--            <n-icon size="15" style="margin-right: 4px" color="#8a919f" :component="ThumbsUpOutline"/>-->
<!--            {{ numberOfLikes }}-->
<!--          </div>-->
        </div>
        <div class="entry-list-bottom-right">
          <n-tag :bordered="false" style="margin-left: 6px" size="small" v-for="tag in item.tags" :key="tag.id + 'tag'"
                 @click.stop="goTabs(tag.name)" class="hover:(text-[#1e80ff] cursor-pointer)">
            {{ tag.name }}
          </n-tag>
        </div>
      </div>
    </div>
    <no-more-data-divider :has-more="false"/>
  </div>
</template>

<style scoped lang="scss">
.entry-list-wrap {
  flex-grow: 1;
  background-color: white;
  border-radius: 0 6px 6px 6px;
  box-shadow: 0 6px 10px 0 rgba(234, 234, 234, 0.8);
}

//类目模块
.entry-list {
  cursor: pointer;
  padding: 17px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid rgba(228, 230, 235, 0.5);

  &:hover {
    background-color: #F7F8FA;
  }

  &:nth-last-child(2) {
    border-bottom: none;
  }

  &-title {
    font-weight: 700;
    font-size: 17px;
    line-height: 24px;
    width: 100%;
    margin-bottom: 3px;
  }

  &-content {
    width: 100%;
    font-size: 13px;
    line-height: 22px;
    margin-bottom: 4px;
    color: #8a919f;
  }

  &-bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;

    &-left {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8a919f;

      &-item {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>