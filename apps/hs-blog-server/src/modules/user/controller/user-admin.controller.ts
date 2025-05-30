import {Body, Controller, Delete, Get, Post, Put} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '@/modules/user/service/profile.service';
import { UpdateProfileDto } from '@/modules/user/dto/profile.dto';
import { ApiResponseObject } from '@/common/decorators/api-response.decorator';
import {userAdminVo, userVo} from '@/modules/user/vo/user.vo';
import { TransformToVo } from '@/common/decorators/transform-to-vo.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { UserService } from '@/modules/user/service/user.service';
import {UserBioService} from "@/modules/user/service/user-bio.service";
import {CreateUserBioDto, UpdateUserBioDto} from "@/modules/user/dto/user-bio.dto";
import {UserBioVo} from "@/modules/user/vo/user-bio.vo";

@ApiTags('admin', '用户模块')
@ApiBearerAuth()
@Controller('admin/user')
export class UserAdminController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    private readonly userBioService: UserBioService
  ) {}

  @ApiOperation({ summary: '获取个人介绍' })
  @Get('personal-profile-info')
  async getProfile() {
    const profile = await this.profileService.getProfile();
    return { data: profile };
  }

  @ApiOperation({ summary: '更新个人介绍' })
  @Put('personal-profile-info')
  updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateProfile(updateProfileDto);
  }

  @Get()
  @ApiOperation({ summary: '获取当前登录用户信息' })
  @ApiResponseObject(userAdminVo)
  @TransformToVo(userAdminVo)
  async getUserInfo(@CurrentUser() user: User) {
    const result = await this.userService.getUserStats(user.id);
    return {
      message: '获取成功',
      data: result,
    };
  }

  @ApiOperation({ summary: '创建或更新用户卡片信息' })
  @Post('bio')
  async createOrUpdate(@Body() createUserBioDto: CreateUserBioDto) {
    await this.userBioService.createOrUpdate(createUserBioDto);
    return {
      message: '操作成功',
    };
  }

  @ApiOperation({ summary: '获取用户卡片信息' })
  @Get('bio')
  @ApiResponseObject(UserBioVo)
  @TransformToVo(UserBioVo)
  async getBio() {
    const result = await this.userBioService.getBio();
    return {
      message: '获取成功',
      data: result,
    };
  }

  @ApiOperation({ summary: '更新用户卡片信息' })
  @Put('bio')
  @ApiResponseObject(UserBioVo)
  @TransformToVo(UserBioVo)
  async update(@Body() updateUserBioDto: UpdateUserBioDto) {
    const result = await this.userBioService.update(updateUserBioDto);
    return {
      message: '更新成功',
      data: result,
    };
  }

  @ApiOperation({ summary: '删除用户卡片信息' })
  @Delete('bio')
  async remove() {
    await this.userBioService.remove();
    return {
      message: '删除成功',
    };
  }
}
