/**
 * 邮件发送选项接口
 */
export interface IEmailOptions {
  /** 收件人邮箱,可以是单个邮箱或邮箱数组 */
  to: string | string[];

  /** 邮件主题 */
  subject: string;

  /** 邮件模板名称 */
  template: string;

  /** 模板上下文数据 */
  context: Record<string, any>;

  /** 抄送人邮箱,可以是单个邮箱或邮箱数组 */
  cc?: string | string[];

  /** 密送人邮箱,可以是单个邮箱或邮箱数组 */
  bcc?: string | string[];

  /** 邮件附件列表 */
  attachments?: Array<{
    /** 附件文件名 */
    filename: string;
    /** 附件内容 */
    content: any;
  }>;
}

/**
 * 邮件发送结果接口
 */
export interface IEmailResult {
  /** 是否发送成功 */
  success: boolean;

  /** 邮件ID,发送成功时返回 */
  messageId?: string;

  /** 发送失败时的错误信息 */
  error?: Error;
}
