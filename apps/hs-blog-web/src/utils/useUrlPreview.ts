import {type Ref, ref} from 'vue';
import {getArticleByUrl} from "~/api/home";
import {HttpStatus} from "~/enums/httpStatus";
import type {UrlPreview} from "~/api/home/type";

// 钩子返回类型
interface UseUrlPreviewReturn {
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  getUrlPreview: (url: string) => Promise<UrlPreview>;
  parseUrl: (url: string) => ParsedUrl;
  extractMainDomain: (url: string) => string;
}

// URL解析结果接口
export interface ParsedUrl {
  domain: string;
  isIp: boolean;
  protocol: string | null;
  port: string | null;
  path: string | null;
}

export function useUrlPreview(cacheExpirationTime: number = 30 * 60 * 1000): UseUrlPreviewReturn {
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  /*获取url预览*/
  const getUrlPreview = async (url: string): Promise<UrlPreview> => {
    loading.value = true;
    error.value = null;

    try {

      const res = await getArticleByUrl({url})
      if (res.code !== HttpStatus.OK) {
        throw new Error(`HTTP错误! 状态: ${res.message}`);
      }

      loading.value = false;
      return res.data;

    } catch (err) {
      loading.value = false;
      error.value = err instanceof Error ? err : new Error('发生错误');
      throw error.value;
    }
  };

  /**
   * 判断字符串是否为有效的 IPv4 地址
   */
  const isValidIPv4 = (ip: string): boolean => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  /**
   * 判断字符串是否为有效的 IPv6 地址
   */
  const isValidIPv6 = (ip: string): boolean => {
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^[0-9a-fA-F]{1,4}::([0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$|^[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}::([0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){2}:([0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){3}:([0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){4}:([0-9a-fA-F]{1,4}:)?[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){5}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){6}:[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(ip);
  };

  /**
   * 解析URL，提取域名或IP地址
   */
  const parseUrl = (urlString: string): ParsedUrl => {
    try {
      // 确保URL包含协议
      if (!urlString.match(/^[a-zA-Z]+:\/\//)) {
        urlString = 'http://' + urlString;
      }

      const url = new URL(urlString);
      const hostname = url.hostname;

      // 检查是否为IP地址
      const isIp = isValidIPv4(hostname) || isValidIPv6(hostname);

      return {
        domain: hostname,
        isIp,
        protocol: url.protocol.replace(':', ''),
        port: url.port || null,
        path: url.pathname === '/' ? null : url.pathname
      };
    } catch (error) {
      throw new Error(`Invalid URL: ${urlString}`);
    }
  };

  /**
   * 获取URL的纯域名（去除子域名）
   */
  const extractMainDomain = (urlString: string): string => {
    try {
      const {domain, isIp} = parseUrl(urlString);

      // 如果是IP地址，直接返回
      if (isIp) return domain;

      // 提取主域名
      const parts = domain.split('.');
      if (parts.length <= 2) return domain;

      // 处理特殊的二级域名情况（如 co.uk, com.cn 等）
      const specialTlds = ['co.uk', 'com.cn', 'com.au', 'co.jp'];
      const lastTwo = parts.slice(-2).join('.');
      if (specialTlds.includes(lastTwo)) {
        return parts.slice(-3).join('.');
      }

      return parts.slice(-2).join('.');
    } catch (error) {
      throw new Error(`域提取的URL无效: ${urlString}`);
    }
  };

  return {
    loading,
    error,
    getUrlPreview,
    parseUrl,
    extractMainDomain
  };
}