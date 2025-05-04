import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '@/enum/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'johndoe' })
  @IsString()
  @MinLength(2, { message: '用户名长度不能小于2位' })
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: '用户名只能包含字母、数字、下划线和连字符' })
  userName: string;

  @ApiProperty({ description: '邮箱地址', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
  
  @ApiProperty({ 
    description: '用户角色', 
    enum: UserRole, 
    default: UserRole.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
