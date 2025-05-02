/**
 * 时间格式转换
 * @param isoString
 * @param useUTC - 是否使用UTC时间 默认false
 */
export const useTimeFormat = (isoString: string, useUTC = false) => {
  let date;
  try {
    date = new Date(isoString);
  } catch (e) {
    throw new Error('无效的 ISO 字符串格式');
  }

  if (isNaN(date.getTime())) {
    throw new Error('无效的 ISO 字符串格式');
  }

  const year = date.getUTCFullYear();
  const month = String(useUTC ? date.getUTCMonth() + 1 : date.getMonth() + 1).padStart(2, '0');
  const day = String(useUTC ? date.getUTCDate() : date.getDate()).padStart(2, '0');

  // 检查原始字符串是否有时间部分
  const hasTimePart = isoString.includes('T') && isoString.split('T')[1].trim() !== '';
  const timePart = hasTimePart
    ? `${String(useUTC ? date.getUTCHours() : date.getHours()).padStart(2, '0')}:${String(useUTC ? date.getUTCMinutes() : date.getMinutes()).padStart(2, '0')}:${String(useUTC ? date.getUTCSeconds() : date.getSeconds()).padStart(2, '0')}`
    : '';

  return `${year}-${month}-${day}${timePart ? ` ${timePart}` : ''}`;
}