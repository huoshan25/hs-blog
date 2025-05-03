<script setup lang="ts">
import { SearchOutline } from "@vicons/ionicons5";
import { useSearchHistory } from "./hook/useSearchHistory";
import { useSearch } from "./hook/useSearch";

const { addSearchHistory, clearSearchHistory, getSearchHistory } = useSearchHistory();

const {
  searchInput,
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
} = useSearch(getSearchHistory, addSearchHistory);

const handleSearch = () => {
  performSearch();
};
</script>

<template>
  <div class="flex items-center relative">
    <client-only>
      <n-input-group>
        <n-input
          maxlength="64"
          :on-focus="onFocusInput"
          :on-blur="onBlurInput"
          :style="{ width: inputStyle.width, transition: inputStyle.transition }"
          :placeholder="searchPlaceholder"
          v-model:value="searchInput"
          @input="handleInput"
          @keyup="handleKeyUp"
        />
        <n-button :color="inputStyle.btColor" @click="handleSearch" aria-label="搜索">
          <template #icon>
            <n-icon :color="inputStyle.iconColor">
              <SearchOutline />
            </n-icon>
          </template>
        </n-button>
      </n-input-group>
      <div v-if="showDropdown && dropdownContent.length" class="search-dropdown bg-white dark:bg-#1a1a1a">
        <div
          v-if="!searchInput"
          class="flex p-[10px] border-b-[1px] border-b-solid border-[#e5e6ecff] dark:border-#918787FF dark:bg-#1a1a1a"
        >
          <div class="color-#8a919f flex-1">搜索记录</div>
          <n-button class="flex-4" text type="info" size="small" @mousedown.stop="clearSearchHistory"> 清空 </n-button>
        </div>
        <div
          v-for="(item, index) in dropdownContent"
          :key="index"
          class="dropdown-item dark:#1a1a1a hover:(dark:bg-#fff dark:c-#1a1a1a bg-#f5f5f5) dark:c-white dark:bg-#1a1a1a py-[8px] px-[12px] cursor-pointer"
          @mousedown="selectItem(item)"
        >
          {{ item }}
        </div>
      </div>
      <template #fallback>
        <skeleton text width="120px" />
      </template>
    </client-only>
  </div>
</template>

<style lang="scss" scoped>
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #e4e6eb;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
  max-width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
