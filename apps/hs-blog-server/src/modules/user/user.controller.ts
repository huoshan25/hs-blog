import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireAuth } from '../auth/decorators/require-auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

/**
 * 用户控制器
 * 处理用户相关的 HTTP 请求
 */
@ApiTags('web', '用户')
@Controller('web/user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  @Get('profile')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: User,
  })
  async getProfile(@CurrentUser() user: User) {
    const result = await this.userService.getUserStats(user.id);
    return {
      message: '获取成功',
      data: result,
    };
  }

  /**
   * 更新用户信息
   * @param user 当前用户信息
   * @param updateUserDto 更新信息
   * @returns 更新后的用户信息
   */
  @Put('profile')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: User,
  })
  async updateProfile(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(user.id, updateUserDto);
    return {
      message: '更新成功',
      data: updatedUser,
    };
  }
}
