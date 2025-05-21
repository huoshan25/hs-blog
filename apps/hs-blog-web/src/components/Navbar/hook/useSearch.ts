import { ref, computed } from "vue";
import { HttpStatus } from "~/enums/httpStatus";
import { useRouter } from "#vue-router";
// import { SearchDimension } from "~/pages/blog/search/components/enum";
import { getArticleQuerySelect } from "~/api/home";

export enum SearchDimension {
  /*综合*/
  SYNTHESIS = 0,
  /*文章*/
  ARTICLE = 1,
  /*标签*/
  TAG = 2,
}

const { $emit } = useNuxtApp();

/**
 * 搜索hook
 * @param getSearchHistory
 * @param addSearchHistory
 */
export const useSearch = (getSearchHistory: () => string[], addSearchHistory: (item: string) => void) => {
  const router = useRouter();
  const route = useRoute();

  /**搜索输入*/
  const searchInput = ref<string>((route.query?.keyword as string) || "");
  /**模糊查询结果*/
  const fuzzyResults = ref<string[]>([]);
  /**是否显示下拉框*/
  const showDropdown = ref(false);
  /**输入框提示内容*/
  const searchPlaceholder = ref("搜索火山博客");
  /**搜索样式*/
  const inputStyle = ref({
    width: "150px",
    btColor: "#f2f3f5",
    iconColor: "#515767",
    transition: "width 0.3s ease"
  });

  /**下拉框内容*/
  const dropdownContent = computed(() => {
    if (searchInput.value) {
      return fuzzyResults.value;
    } else {
      return getSearchHistory();
    }
  });

  /**聚焦*/
  const onFocusInput = () => {
    searchPlaceholder.value = "搜索文章/标签";
    $emit('search-focus-change', true);

    setTimeout(() => {
      if (window.innerWidth <= 768) {
        inputStyle.value.width = "calc(100vw - 150px)";
      } else {
        inputStyle.value.width = "300px";
      }
      inputStyle.value.btColor = "#e8f0fd";
      inputStyle.value.iconColor = "#1e80ff";
    }, 10);
    showDropdown.value = true;
  };

  /**失焦*/
  const onBlurInput = () => {
    $emit('search-focus-change', false);

    setTimeout(() => {
      searchPlaceholder.value = "搜索火山博客";
      inputStyle.value.width = "150px";
      inputStyle.value.btColor = "#f2f3f5";
      inputStyle.value.iconColor = "#515767";
      showDropdown.value = false;
    }, 200);
  };

  /**输入框事件*/
  const handleInput = async () => {
    if (searchInput.value) {
      const res = await getArticleQuerySelect({ keyword: searchInput.value });
      if (res.code === HttpStatus.OK) {
        fuzzyResults.value = res.data.map((item: any) => item.title);
      }
    } else {
      fuzzyResults.value = [];
    }
  };

  /**执行搜索*/
  const performSearch = async () => {
    if (searchInput.value) {
      addSearchHistory(searchInput.value);
      await router.push({
        path: "/blog/search",
        query: {
          keyword: searchInput.value,
          type: SearchDimension.SYNTHESIS
        }
      });
    }
    showDropdown.value = false;
  };

  /**键盘事件*/
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  /**选择项*/
  const selectItem = (title: string) => {
    searchInput.value = title;
    performSearch();
  };

  return {
    searchInput,
    fuzzyResults,
    showDropdown,
    searchPlaceholder,
    inputStyle,
    dropdownContent,
    onFocusInput,
    onBlurInput,
    handleInput,
    handleKeyUp,
    performSearch,
    selectItem
  };
};
