import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SearchDimension } from "~/pages/search/components/enum"

export const useTabs = () => {
  const route = useRoute()
  const router = useRouter()

  const currentTab = ref<SearchDimension>(SearchDimension.SYNTHESIS)

  /*type值是否有效*/
  const isValidTabType = (type: number): boolean => {
    return Object.values(SearchDimension).includes(type)
  }

  /*更新tab*/
  const updateCurrentTab = (type: string | number | undefined) => {
    let newType: number;

    if (type === '' || type === undefined) {
      newType = SearchDimension.SYNTHESIS;
    } else {
      newType = Number(type);
    }

    if (isValidTabType(newType)) {
      currentTab.value = newType;
    } else {
      newType = SearchDimension.SYNTHESIS;
      currentTab.value = newType;
    }

    // 更新 URL，确保 type 参数始终有有效值
    router.replace({ query: { ...route.query, type: newType.toString() } }).then();
  };

  /*点击更新*/
  const handleUpdateValue = (tabValue: SearchDimension) => {
    updateCurrentTab(tabValue)
    router.push({
      path: '/search',
      query: { ...route.query, type: tabValue }
    }).then()
  }

  onMounted(() => {
    updateCurrentTab(Number(route.query.type))
  })

  watch(() => route.query.type, (newType) => {
    updateCurrentTab(Number(newType))
  })

  return {
    currentTab,
    handleUpdateValue,
  }
}