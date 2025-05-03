import {Body, Controller, Get, Put} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {ApiResponseObject} from '@/common/decorators/api-response.decorator';
import {userVo} from '@/modules/user/vo/user.vo';
import {TransformToVo} from '@/common/decorators/transform-to-vo.decorator';
import {CurrentUser} from '@/modules/auth/decorators/current-user.decorator';
import {User} from '@/modules/user/entities/user.entity';
import {UpdateUserDto} from '@/modules/user/dto/update-user.dto';
import {ProfileService} from '@/modules/user/service/profile.service';
import {UserService} from '@/modules/user/service/user.service';
import {Public} from "@/modules/auth/decorators/public.decorator";

/**
 * 用户控制器
 * 处理用户相关的 HTTP 请求
 */
@ApiTags('blog', '用户')
@Controller('blog/user')
@Public()
@ApiBearerAuth()
export class UserBlogController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: '获取当前登录用户信息' })
  @ApiResponseObject(userVo)
  @TransformToVo(userVo)
  async getProfile(@CurrentUser() user: User) {
    const result = await this.userService.getUserStats(user.id);
    return {
      message: '获取成功',
      data: result,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: '获取用户统计信息' })
  async getUserStats(@CurrentUser() user: User) {
    const stats = await this.userService.getUserStats(user.id);
    return {
      message: '获取用户统计信息成功',
      data: stats,
    };
  }

  @Put('profile')
  @ApiOperation({ summary: '更新用户个人资料' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update(user.id, updateUserDto);
    return {
      message: '更新成功',
      data: updatedUser,
    };
  }

  @ApiOperation({ summary: '获取个人简介信息' })
  @Get('personal-profile-info')
  async getConcise() {
    const result = await this.profileService.getProfile();
    return {
      data: result,
    }
  }

  /**
   * 个人模块信息
   */
  @Get()
  async getUserInfo() {
    const data = {
      name: 'volcano',
      avatar: '/img/avatar.jpg',
      avatarBackgroundImage: 'https://hs-blog.oss-cn-beijing.aliyuncs.com/user/PixPin_2024-10-18_10-32-30.png',
      description: '“风很温柔 花很浪漫 你很特别 我很喜欢”',
      articlesTotal: 0,
      categoriesTotal: 0,
      tagTotal: 0,
    };
    return {
      data
    }
  }
}
