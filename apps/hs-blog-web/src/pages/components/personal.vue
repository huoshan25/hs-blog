<script setup lang="ts">
  import { getTagsList } from '~/api/tag'
  import { getUserBio } from '~/api/user'

  const props = defineProps({
    categoryList: {
      type: Object,
      default() {
        return {}
      }
    }
  })

  const { data: userInfo } = useAsyncData('userInfo', () => getUserBio())

  const { data: tagsData } = useAsyncData('tags', () => getTagsList())
</script>

<template>
  <div class="personal">
    <div class="personal-contents">
      <div class="top-backgroundImage" :style="{ backgroundImage: `url(${userInfo?.data.bgImg})` }"></div>
      <div class="personal-introduced">
        <nuxt-img class="personal-introduced-avatar" src="img/avatar.jpg" alt="avatar" width="65px" height="65px" />
      </div>
      <div class="personal-introduced-name">{{ userInfo?.data.name }}</div>
      <div class="personal-introduced-description">{{ userInfo?.data.description }}</div>
    </div>
    <div class="personal-bottom">
      <div class="personal-bottom-item">
        <div class="text-center c-#212529 font-600 text-[16px]">文章</div>
        <div class="text-center c-#212529">
          <number-animation :from="0" :to="tagsData?.data.article_total" />
        </div>
      </div>
      <div class="personal-bottom-item">
        <div class="text-center c-#212529 font-600 text-[16px]">分类</div>
        <div class="text-center">
          <number-animation :from="0" :to="props.categoryList.length" />
        </div>
      </div>
      <div class="personal-bottom-item">
        <div class="text-center c-#212529 font-600 text-[16px]">标签</div>
        <div class="text-center">
          <number-animation :from="0" :to="tagsData?.data.tag_total" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .personal {
    background-color: white;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: space-between;

    &-contents {
      width: 100%;
      flex-grow: 1;

      .top-backgroundImage {
        object-fit: cover;
        background-position-x: center;
        background-position-y: center;
        background-size: cover;
        min-height: 120px;
        width: 100%;
        overflow: hidden;
        border-top-right-radius: 6px;
        border-top-left-radius: 6px;
        position: relative;

        &:after {
          content: '';
          width: 100%;
          height: 40%;
          position: absolute;
          bottom: 0;
          left: 0;
          background: linear-gradient(to top, #fff, transparent);
        }
      }

      .personal-introduced {
        text-align: center;

        &-avatar {
          position: absolute;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          border: rgba(255, 255, 255, 0.4) 4px solid;
          width: 59px;
          height: 59px;
          border-radius: 50%;
        }
      }

      .personal-introduced-name {
        font-size: 20px;
        font-weight: 900;
        color: #212529;
        margin-top: 40px;
        margin-bottom: 5px;
        text-align: center;
      }

      .personal-introduced-description {
        text-align: center;
        color: #a6a5a5;
        padding: 0 25px;
        margin-bottom: 10px;
      }
    }

    &-bottom {
      display: flex;
      justify-content: center;
      border-top: 1px solid #dee2e6;

      &-item {
        padding: 9px;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
