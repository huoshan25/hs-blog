import { useCallback, useEffect, useState } from 'react';

/**
 * React自定义钩子：localStorage状态管理
 * @param key 存储键名
 * @param initialValue 初始值
 * @returns [值, 设置值函数]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 获取初始值
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 设置值函数
  const setValue = useCallback((value: T) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 监听其他窗口的storage变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

/**
 * React自定义钩子：媒体查询
 * @param query 媒体查询字符串
 * @returns 是否匹配
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);
    
    // 初始化
    updateMatches();
    
    // 监听变化
    mediaQuery.addEventListener('change', updateMatches);
    
    // 清理
    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

/**
 * React自定义钩子：简易的异步请求状态管理
 * @param asyncFunction 异步函数
 * @returns [执行函数, 加载状态, 结果, 错误]
 */
export function useAsync<T, P extends any[]>(
  asyncFunction: (...args: P) => Promise<T>
): [(...args: P) => Promise<T | null>, boolean, T | null, Error | null] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (...args: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (e) {
      setError(e as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return [execute, loading, data, error];
} 