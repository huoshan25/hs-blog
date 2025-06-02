import {Body, Controller, Get, Put, Query} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseObject } from '@/common/decorators/api-response.decorator';
import { userVo } from '@/modules/user/vo/user.vo';
import { TransformToVo } from '@/common/decorators/transform-to-vo.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { ProfileService } from '@/modules/user/service/profile.service';
import { UserService } from '@/modules/user/service/user.service';
import { Public } from '@/modules/auth/decorators/public.decorator';
import {UserBioVo} from "@/modules/user/vo/user-bio.vo";
import {UserBioService} from "@/modules/user/service/user-bio.service";

@ApiTags('blog', '用户')
@Controller('blog/user')
@ApiBearerAuth()
export class UserBlogController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly userBioService: UserBioService
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

  @Get('info')
  @ApiOperation({ summary: '查询用户信息' })
  @Public()
  async getUserInfo(@Query('id') id: number) {
    const result = await this.userService.findById(id);
    return {
      message: '获取成功',
      data: result,
    };
  }

  // @Get('stats')
  // @ApiOperation({ summary: '获取用户统计信息' })
  // async getUserStats(@CurrentUser() user: User) {
  //   const stats = await this.userService.getUserStats(user.id);
  //   return {
  //     message: '获取用户统计信息成功',
  //     data: stats,
  //   };
  // }

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
  @Public()
  @Get('personal-profile-info')
  async getConcise() {
    const result = await this.profileService.getProfile();
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '获取用户卡片信息' })
  @Get('bio')
  @Public()
  @ApiResponseObject(UserBioVo)
  @TransformToVo(UserBioVo)
  async getBio() {
    const result = await this.userBioService.getBio();
    return {
      message: '获取成功',
      data: result,
    };
  }
}
