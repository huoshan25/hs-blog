import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: '用户名',
    example: 'skyuser',
    minLength: 3,
  })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名长度不能小于3位' })
  username: string;

  @ApiProperty({
    description: '邮箱地址',
    example: 'example@sky.com',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱地址不能为空' })
  email: string;

  @ApiProperty({
    description: '密码',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  password: string;

  @ApiProperty({
    description: '确认密码',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: '确认密码必须是字符串' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  @MinLength(6, { message: '确认密码长度不能小于6位' })
  confirmPassword: string;

  @ApiProperty({
    description: '邮箱验证码',
    example: '123456',
  })
  @IsString({ message: '验证码必须是字符串' })
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;
}

export class LoginDto {
  @ApiProperty({
    description: '用户名或邮箱',
    example: 'skyuser',
  })
  @IsString({ message: '用户名或邮箱必须是字符串' })
  @IsNotEmpty({ message: '用户名或邮箱不能为空' })
  usernameOrEmail: string;

  @ApiProperty({
    description: '密码',
    example: 'password123',
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

/**
 * 登录响应DTO
 */
export class LoginResponseDto {
  /**
   * 访问令牌
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJzdWIiOjEsImlhdCI6MTYyMjUwNjIwMCwiZXhwIjoxNjIyNTkyNjAwfQ.hV8vjvTrDCv8PuYvPbVuZQX8v-lh9kKl'
   */
  @ApiProperty({ description: '访问令牌' })
  accessToken: string;

  /**
   * 刷新令牌
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJzdWIiOjEsImlhdCI6MTYyMjUwNjIwMCwiZXhwIjoxNjIyNzY1NDAwfQ.2Qh4j0'
   */
  @ApiProperty({ description: '刷新令牌' })
  refreshToken: string;
  
  /**
   * 访问令牌过期时间（秒）
   * @example 86400
   */
  @ApiProperty({ description: '访问令牌过期时间（秒）' })
  expiresIn: number;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty({ message: '刷新令牌不能为空' })
  refreshToken: string;
}
