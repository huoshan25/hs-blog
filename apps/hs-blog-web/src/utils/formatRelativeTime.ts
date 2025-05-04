/**
 * 格式化相对时间
 * @param isoDateString - ISO 格式的日期字符串
 * @returns 格式化后的相对时间字符串
 */
export const formatRelativeTime = (isoDateString: string): string => {
  try {
    const date: Date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期');
    }

    const now: Date = new Date();
    const diff: number = now.getTime() - date.getTime();
    const absDiff: number = Math.abs(diff);
    const seconds: number = Math.floor(absDiff / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);
    const days: number = Math.floor(hours / 24);
    const months: number = Math.floor(days / 30);
    const years: number = Math.floor(days / 365);

    if (diff < 0) {
      if (seconds < 60) return "马上";
      if (minutes < 60) return `${minutes}分钟后`;
      if (hours < 24) return `${hours}小时后`;
      if (days < 30) return `${days}天后`;
      if (months < 12) return `${months}个月后`;
      return `${years}年后`;
    } else {
      if (seconds < 60) return "刚刚";
      if (minutes < 60) return `${minutes}分钟前`;
      if (hours < 24) return `${hours}小时前`;
      if (days < 30) return `${days}天前`;
      if (months < 12) return `${months}个月前`;
      return `${years}年前`;
    }
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '无效的日期';
  }
}