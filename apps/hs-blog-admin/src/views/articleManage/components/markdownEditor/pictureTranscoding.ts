import { createDiscreteApi } from "naive-ui";

const { message } = createDiscreteApi(['message'])

/**
 * 图片处理选项接口
 * @interface ImageProcessingOptions
 * @property maxWidth - 图片的最大宽度
 * @property quality - 图片压缩质量（0-1）
 * @property watermarkText - 水印文字
 */
interface ImageProcessingOptions {
  maxWidth: number;
  quality: number;
  watermarkText: string;
}

/**
 * 图片上传处理函数类型
 * @param pos - 图片位置信息
 * @para dataURL - 处理后的图片数据URL
 */
type ImageUploadHandler = (pos: any, dataURL: string) => void;

/**
 * 图片处理类
 * @class ImageProcessor
 */
export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('未能获取画布上下文');
    this.ctx = ctx;
  }

  /**
   * 处理图片
   * @param {File} file - 要处理的图片文件
   * @param {ImageProcessingOptions} options - 图片处理选项
   * @returns {Promise<string>} 处理后的图片数据URL
   */
  async processImage(file: File, options: ImageProcessingOptions): Promise<string> {
    const img = await createImageBitmap(file);
    this.resizeImage(img, options.maxWidth);
    this.addWatermark(options.watermarkText);
    return this.getDataURL('image/jpeg', options.quality);
  }

  /**
   * 调整图片大小
   * @private
   * @param {ImageBitmap} img - 原始图片
   * @param {number} maxWidth - 最大宽度
   */
  private resizeImage(img: ImageBitmap, maxWidth: number): void {
    const scale = Math.min(1, maxWidth / img.width);
    this.canvas.width = img.width * scale;
    this.canvas.height = img.height * scale;
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 添加水印
   * @private
   * @param {string} text - 水印文字
   */
  private addWatermark(text: string): void {
    const fontSize = Math.max(19, Math.min(this.canvas.width, this.canvas.height) * 0.02);
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';

    const metrics = this.ctx.measureText(text);
    const textWidth = metrics.width;

    const x = this.canvas.width - textWidth - 10;
    const y = this.canvas.height - 10;

    this.ctx.fillText(text, x, y);
  }

  /**
   * 获取图片数据URL
   * @private
   * @param {string} type - 图片类型
   * @param {number} quality - 图+片质量
   * @returns {string} 图片数据URL
   */
  private getDataURL(type: string, quality: number): string {
    return this.canvas.toDataURL(type, quality);
  }
}

/**
 * 错误处理类
 * @class ErrorHandler
 */
class ErrorHandler {
  /**
   * 处理错误
   * @static
   * @param {Error} error - 错误对象
   */
  static handleError(error: Error): void {
    console.error('Error processing image:', error);
    message.error('图片处理失败');
  }
}

/**
 * 创建图片上传处理函数
 * @function createImageUploadHandler
 * @param imageProcessor - 图片处理器实例
 * @param uploadHandler - 图片上传处理函数
 * @param options - 图片处理选项
 * @returns 图片上传处理函数
 */
export const createImageUploadHandler = (
  imageProcessor: ImageProcessor,
  uploadHandler: ImageUploadHandler,
  options: ImageProcessingOptions
) => {
  return async (pos: any, file: File) => {
    try {
      const dataURL = await imageProcessor.processImage(file, options);
      uploadHandler(pos, dataURL);
    } catch (error) {
      ErrorHandler.handleError(error as Error);
    }
  };
};

//示例
// const imageProcessor = new ImageProcessor();
//
// const handleImageUpload = createImageUploadHandler(
//   imageProcessor,
//   (pos, dataURL) => {
//     if (editorRef.value) {
//       editorRef.value.$img2Url(pos, dataURL);
//     }
//   },
//   {
//     maxWidth: 800,
//     quality: 0.5,
//     watermarkText: '火山博客'
//   }
// );

/**
 * 处理图片粘贴的函数
 * @param pos 图片位置
 * @param $file 图片文件
 */
// const handleImageUpload = async (pos: any, $file: File) => {
//   try {
//     const img = await createImageBitmap($file);
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     if (!ctx) throw new Error('Failed to get canvas context');
//
//     /*压缩图片尺寸*/
//     const maxWidth = 800;
//     const scale = maxWidth / img.width;
//     canvas.width = maxWidth;
//     canvas.height = img.height * scale;
//
//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//
//     /*添加水印*/
//     ctx.font = '14px Arial';
//     ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
//     ctx.fillText('@火山博客', canvas.width - 10, canvas.height - 10);
//
//     /**
//      * 压缩质量并转换为 base64
//      * @param type 图片类型，如：'image/jpeg'
//      * @param quality 压缩质量，取值范围：0-1
//      *
//      */
//     const dataURL = canvas.toDataURL('image/jpeg', 0.7);
//     editorRef.value.$img2Url(pos, dataURL);
//   } catch (error) {
//     console.error('Error processing image:', error);
//     message.error('图片处理失败');
//   }
// };
