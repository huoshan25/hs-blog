import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({ description: '旧密码', example: 'oldPassword123' })
  @IsString({ message: '旧密码必须是字符串' })
  @IsNotEmpty({ message: '旧密码不能为空' })
  @MinLength(6, { message: '旧密码长度不能小于6位' })
  @MaxLength(20, { message: '旧密码长度不能大于20位' })
  oldPassword: string;

  @ApiProperty({ description: '新密码', example: 'newPassword123' })
  @IsString({ message: '新密码必须是字符串' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @MinLength(6, { message: '新密码长度不能小于6位' })
  @MaxLength(20, { message: '新密码长度不能大于20位' })
  newPassword: string;

  @ApiProperty({ description: '确认新密码', example: 'newPassword123' })
  @IsString({ message: '确认密码必须是字符串' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  @MinLength(6, { message: '确认密码长度不能小于6位' })
  @MaxLength(20, { message: '确认密码长度不能大于20位' })
  confirmPassword: string;
} 