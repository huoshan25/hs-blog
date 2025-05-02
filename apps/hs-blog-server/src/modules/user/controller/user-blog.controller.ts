import {Body, Controller, Get, Put} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {ApiResponseObject} from '@/common/decorators/api-response.decorator';
import {userVo} from '@/modules/user/vo/user.vo';
import {TransformToVo} from '@/common/decorators/transform-to-vo.decorator';
import {UserService} from '@/modules/user/user.service';
import {CurrentUser} from '@/modules/auth/decorators/current-user.decorator';
import {User} from '@/modules/user/entities/user.entity';
import {UpdateUserDto} from '@/modules/user/dto/update-user.dto';

/**
 * 用户控制器
 * 处理用户相关的 HTTP 请求
 */
@ApiTags('blog', '用户')
@Controller('blog/user')
@ApiBearerAuth()
export class UserBlogController {
  constructor(private readonly userService: UserService) {}

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
}
