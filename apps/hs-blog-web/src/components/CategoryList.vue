<script setup lang="ts">
const router = useRouter();
const props = defineProps({
  categoryList: {
    type: Object,
    default() {
      return {};
    }
  }
});

export interface ICategory {
  id?: number;
  alias?: string;
  /**分类名称*/
  name?: string;
  /**分类图片*/
  icon?: string;
}

/**分类路径*/
const currentPath = ref("");

onMounted(async () => {
  currentPath.value = router.currentRoute.value.path === "/" ? "/all" : router.currentRoute.value.path;
});
</script>

<template>
  <div class="category-wrap">
    <ul class="category-list">
      <li v-for="item in props.categoryList" :key="item.id">
        <nuxt-link :to="item.alias" active-class="active" :class="{ active: currentPath === item.alias }">
          <nuxt-img :src="item.icon" alt="category" format="webp" width="25px" height="25px" />
          <span>{{ item.name }}</span>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.category-wrap {
  width: 200px;
  top: 0;
  left: 0;
  bottom: 0;
  position: relative;
  z-index: 1;
}

.category-list li a {
  padding-left: 40px;
  font-size: 15px;
  height: 53px;
  position: relative;
  display: flex;
  align-items: center;
  color: #4f6174;
  font-weight: 500;
  margin-bottom: 5px;
  border-radius: 5px 0 0 5px;
  transition: background 0.3s;
}

.category-list li a.active,
.category-list li a:hover {
  background: white;
  box-shadow: 0 6px 5px -5px rgba(234, 234, 234, 0.8);
}

.category-list li a.active img,
.category-list li a.active span,
.category-list li a:hover img,
.category-list li a:hover span {
  transform: translateX(-2px);
}

.category-list li a.active img,
.category-list li a:hover img {
  filter: grayscale(0);
}

.category-list li a img {
  max-width: 25px;
  max-height: 25px;
  filter: grayscale(1);
  transition: all 0.3s;
}

.category-list li a span {
  padding-left: 8px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  transition: transform 0.3s;
}

@media (max-width: 895px) {
  .category-wrap {
    display: none;
  }
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
