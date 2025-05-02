export interface TemporarySignatureResponse {
  accessKeyId: string;
  accessKeySecret: string;
  securityToken: string;
  bucket: string;
  region: string;
}

export interface PictureUploadReq {
  /*图片文件*/
  category_image: File;
  /*文章UUID*/
  articleUUID: string;
}

/**
 * 上传文件 - 数据流
 */
export async function pictureUpload(params: FormData) {
  return await request.post<{ fileUrl: string }>("/oss/ali/article-img", params);
}
