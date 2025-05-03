import {useStorage} from "@vueuse/core";

/**
 * 历史记录hook
 */
export const useSearchHistory = () => {
  const searchHistory = useStorage<string[]>('searchHistory', [])

  /*添加搜索记录*/
  const addSearchHistory = (keyword: string) => {
    if (!keyword.trim()) return
    const index = searchHistory.value.indexOf(keyword)
    if (index !== -1) {
      searchHistory.value.splice(index, 1)
    }
    searchHistory.value.unshift(keyword)
    if (searchHistory.value.length > 6) {
      searchHistory.value.pop()
    }
  }

  /*清除搜索历史*/
  const clearSearchHistory = () => {
    searchHistory.value = []
  }

  /*获取搜索历史*/
  const getSearchHistory = () => searchHistory.value

  return {
    addSearchHistory,
    clearSearchHistory,
    getSearchHistory,
  }
}