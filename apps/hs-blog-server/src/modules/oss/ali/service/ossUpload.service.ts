import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';
import { Readable } from 'stream';
import { format } from 'date-fns';
import { OssConfigService } from './ossConfig.service';

/**
 * 文件上传选项接口
 */
export interface FileUploadOptions {
  /** 文件存储的目录路径，如 'avatar', 'article/123' 等 */
  directory: string;
  /** 自定义文件名（可选），不提供则自动生成 */
  customFileName?: string;
  /** 是否返回完整URL（默认false，只返回OSS结果） */
  returnFullUrl?: boolean;
  /** 文件名前缀（可选） */
  prefix?: string;
}

@Injectable()
export class OssUploadService {
  private ossClient: OSS;
  private readonly ossEndpoint: string;
  private readonly ossBucket: string;

  constructor(private ossConfigService: OssConfigService) {
    this.ossClient = this.ossConfigService.createOssClient();
    this.ossEndpoint = this.ossConfigService.getOssEndpoint();
    this.ossBucket = this.ossConfigService.getOssBucket();322
  }

  /**
   * 通用文件上传方法
   * @param file 要上传的文件
   * @param options 上传选项
   */
  async uploadFileGeneric(file: Express.Multer.File, options: FileUploadOptions) {
    const stream = Readable.from(file.buffer);

    let fileName: string;
    if (options.customFileName) {
      fileName = options.customFileName;
    } else {
      const fileExtension = file.originalname.split('.').pop();
      const timestamp = format(new Date(), 'yyyy-MMdd-HHmmss');
      const prefix = options.prefix ? `${options.prefix}-` : '';
      fileName = `${prefix}${timestamp}.${fileExtension}`;
    }

    const objectName = `${options.directory}/${fileName}`;

    const result = await this.ossClient.putStream(objectName, stream);

    if (options.returnFullUrl) {
      return {
        ...result,
        url: `http://${this.ossEndpoint}/${objectName}`
      };
    }
    
    return result;
  }

  /**
   * 数据流上传
   * @param file
   * @param articleUUID 文章uuid
   *
   */
  async uploadFile(file: Express.Multer.File, articleUUID: string) {
    const stream = Readable.from(file.buffer);
    /*生成新的文件名*/
    const fileExtension = file.originalname.split('.').pop();
    const newFileName = `${format(new Date(), 'yyyy-MMdd-HHmmss')}.${fileExtension}`;

    const objectName = `article/${articleUUID}/${newFileName}`;

    const result = await this.ossClient.putStream(objectName, stream);
    return {
      ...result,
    };
  }

  /**
   * 数据流上传 - 分类图片上传
   * @param category_image 分类图片
   * @param category_id 分类id
   *
   */
  async uploadFileCategory(category_image: Express.Multer.File, category_id: string) {
    const stream = Readable.from(category_image.buffer);
    /*生成新的文件名*/
    const fileExtension = category_image.originalname.split('.').pop();
    const newFileName = `${format(new Date(), 'yyyy-MMdd-HHmmss')}.${fileExtension}`;

    const objectName = `category/${category_id}/${newFileName}`;

    const result = await this.ossClient.putStream(objectName, stream);
    return {
      ...result,
    };
  }

  /**
   * 上传音频文件
   * @param buffer 音频文件buffer
   * @param articleId 文章ID
   * @param fileName 文件名
   */
  async uploadAudioFile(buffer: Buffer, articleId: string, fileName: string) {
    const stream = Readable.from(buffer);
    const objectName = `article/${articleId}/audio/${fileName}`;

    const result = await this.ossClient.putStream(objectName, stream);
    return {
      ...result,
      url: `http://${this.ossBucket}.${this.ossEndpoint}/${objectName}`
    };
  }

  /**
   * 上传音频文件
   * @param audioBuffer 音频buffer
   * @param articleUUID 文章UUID
   * @param type 音频类型
   */
  async uploadAudioBuffer(audioBuffer: Buffer, articleUUID: string, type: 'short' | 'long') {
    const stream = Readable.from(audioBuffer);
    const fileName = `${type}-${format(new Date(), 'yyyy-MMdd-HHmmss')}.mp3`;
    const objectName = `article/${articleUUID}/audio/${fileName}`;

    const result = await this.ossClient.putStream(objectName, stream);
    return {
      ...result,
    };
  }

  /**
   * 获取文件的完整URL
   * @param objectName OSS对象名称
   * @returns 完整的访问URL
   */
  getFileUrl(objectName: string): string {
    return `http://${this.ossBucket}.${this.ossEndpoint}/${objectName}`;
  }
}