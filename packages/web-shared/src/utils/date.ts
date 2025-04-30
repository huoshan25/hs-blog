/**
 * 日期工具函数
 */

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式模板，例如 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date);
  
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  const second = d.getSeconds().toString().padStart(2, '0');
  
  return format
    .replace(/YYYY/g, year)
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hour)
    .replace(/mm/g, minute)
    .replace(/ss/g, second);
}

/**
 * 获取相对时间描述，如"刚刚"、"5分钟前"等
 * @param date 日期对象或时间戳
 * @returns 相对时间描述字符串
 */
export function getRelativeTime(date: Date | number | string): string {
  const now = new Date().getTime();
  const timestamp = new Date(date).getTime();
  const diff = now - timestamp;
  
  // 时间差的毫秒数
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (diff < 60000) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 30) {
    return `${days}天前`;
  } else {
    return formatDate(date, 'YYYY-MM-DD');
  }
} 