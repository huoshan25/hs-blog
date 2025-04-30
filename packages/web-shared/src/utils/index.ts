/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 格式化模式
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 截取文本
 * @param text 原始文本
 * @param length 截取长度
 * @param suffix 后缀
 * @returns 截取后的文本
 */
export function truncateText(text: string, length: number = 100, suffix: string = '...'): string {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + suffix;
}

/**
 * 深拷贝对象
 * @param obj 需要拷贝的对象
 * @returns 拷贝后的新对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    const copy = {} as Record<string, any>;
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as Record<string, any>)[key]);
    });
    return copy as T;
  }

  return obj;
}

/**
 * 从URL获取查询参数
 * @param name 参数名
 * @returns 参数值
 */
export function getQueryParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get(name);
}

/**
 * 安全地获取对象嵌套属性值
 * @param obj 对象
 * @param path 路径，如 'user.profile.name'
 * @param defaultValue 默认值
 * @returns 属性值或默认值
 */
export function getNestedValue<T, D = undefined>(
  obj: any,
  path: string,
  defaultValue?: D
): T | D | undefined {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue;
    }
    result = result[key];
  }

  return (result === undefined) ? defaultValue : result;
} 