import {Expose} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';

/**
 * 用户登录VO
 */
export class LoginResponseVo {
  @Expose()
  @ApiProperty({ description: '用户token' })
  accessToken: string;
  @Expose()
  @ApiProperty({ description: '刷新token' })
  refreshToken: string;
}

/**
 * 注册响应VO
 */
export class registerResVo {
  @Expose()
  @ApiProperty({ description: '用户token' })
  accessToken: string;
  @Expose()
  @ApiProperty({ description: '刷新token' })
  refreshToken: string;
}

export class userVo {
  @Expose()
  @ApiProperty({ description: '用户id' })
  id: number;
  @Expose()
  @ApiProperty({ description: '用户名' })
  userName: string;
  @Expose()
  @ApiProperty({ description: '邮箱' })
  email: string;
  @Expose()
  @ApiProperty({ description: '头像' })
  avatar: string;
  @Expose()
  @ApiProperty({ description: '个人简介' })
  bio: string;
}

export class userAdminVo extends userVo {
  @Expose()
  @ApiProperty({ description: '角色 user:普通用户 admin:管理员' })
  role: string;
}
