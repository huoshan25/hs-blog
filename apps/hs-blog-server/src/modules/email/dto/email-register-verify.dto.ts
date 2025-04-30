import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

/**
 * 校验邮箱格式
 */
export class EmailRegisterVerifyDto {
  @IsEmail()
  @IsNotEmpty({ message: '邮箱不能为空' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: '请输入正确的邮箱格式' })
  email: string;
}
