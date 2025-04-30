import { ref, watch, onMounted, onUnmounted, Ref, ComputedRef, unref } from 'vue';

/**
 * Vue组合式API：localStorage状态管理
 * @param key 存储键名
 * @param initialValue 初始值
 * @returns [值, 设置值函数]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [Ref<T>, (value: T) => void] {
  // 获取初始值
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const storedValue = ref<T>(readValue()) as Ref<T>;

  // 设置值函数
  const setValue = (value: T) => {
    try {
      const newValue = value instanceof Function ? value(unref(storedValue)) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      storedValue.value = newValue;
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 初始化时同步
  onMounted(() => {
    storedValue.value = readValue();
  });

  // 监听其他窗口的storage变化
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      storedValue.value = JSON.parse(e.newValue);
    }
  };

  onMounted(() => {
    window.addEventListener('storage', handleStorageChange);
  });

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange);
  });

  return [storedValue, setValue];
}

/**
 * Vue组合式API：媒体查询
 * @param query 媒体查询字符串
 * @returns 是否匹配
 */
export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref<boolean>(false) as Ref<boolean>;

  onMounted(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => {
      matches.value = mediaQuery.matches;
    };
    
    // 初始化
    updateMatches();
    
    // 监听变化
    mediaQuery.addEventListener('change', updateMatches);
    
    // 清理
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', updateMatches);
    });
  });

  return matches;
}

/**
 * Vue组合式API：简易的异步请求状态管理
 * @param asyncFunction 异步函数
 * @returns [执行函数, 加载状态, 结果, 错误]
 */
export function useAsync<T, P extends any[]>(
  asyncFunction: (...args: P) => Promise<T>
): [(...args: P) => Promise<T | null>, Ref<boolean>, Ref<T | null>, Ref<Error | null>] {
  const loading = ref<boolean>(false) as Ref<boolean>;
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<Error | null>(null) as Ref<Error | null>;

  const execute = async (...args: P): Promise<T | null> => {
    try {
      loading.value = true;
      error.value = null;
      const result = await asyncFunction(...args);
      data.value = result;
      return result;
    } catch (e) {
      error.value = e as Error;
      return null;
    } finally {
      loading.value = false;
    }
  };

  return [execute, loading, data, error];
} 