/**
 * 链接预览数据接口
 */
export interface UrlPreview {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName?: string;
  favicon?: string;
}