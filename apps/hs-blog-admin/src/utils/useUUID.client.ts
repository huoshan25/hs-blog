/**
 * 创建UUID
 */
export const useUUID = () => {
  const generateUUID = (length: number = 32): string => {
    if ('randomUUID' in crypto) {
      return crypto.randomUUID().replace(/-/g, '').slice(0, length);
    } else {
      return fallbackUUID(length);
    }
  };

  const fallbackUUID = (length: number = 32): string => {
    const chars = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  return {
    generateUUID
  }
}