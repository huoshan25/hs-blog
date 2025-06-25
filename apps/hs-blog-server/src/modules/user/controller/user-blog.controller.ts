import { Body, Controller, Get, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
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
import { UserBioVo } from '@/modules/user/vo/user-bio.vo';
import { UserBioService } from '@/modules/user/service/user-bio.service';
import { UserLevelService } from '@/modules/user/service/user-level.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssUploadService } from '@/modules/oss/ali/service/ossUpload.service';
import { UpdateUserPasswordDto } from '@/modules/user/dto/update-user-password.dto';
import { OssFileManagementService } from '@/modules/oss/ali/service/ossFileManagement.service';

@ApiTags('blog', '用户')
@Controller('blog/user')
@ApiBearerAuth()
export class UserBlogController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly userBioService: UserBioService,
    private readonly userLevelService: UserLevelService,
    private readonly ossUploadService: OssUploadService,
    private readonly ossFileManagementService: OssFileManagementService,
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

  @ApiOperation({ summary: '获取当前用户的等级信息' })
  @Get('level/me')
  async getCurrentUserLevelInfo(@CurrentUser() user: User) {
    const levelInfo = await this.userLevelService.getUserLevelInfo(user.id);
    return {
      data: {
        level: levelInfo.level,
        points: levelInfo.points,
        currentPoints: levelInfo.progress.currentPoints,
        nextLevelPoints: levelInfo.progress.nextLevelPoints,
        percentage: levelInfo.progress.percentage,
        currentLevel: levelInfo.progress.currentLevel,
        nextLevel: levelInfo.progress.nextLevel,
      },
    };
  }

  @Post('avatar')
  @ApiOperation({ summary: '更新用户头像' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return {
        code: 400,
        message: '没有上传文件',
      };
    }

    try {
      const currentUser = await this.userService.findById(user.id);
      const oldAvatarUrl = currentUser.avatar;
      
      const result = await this.ossUploadService.uploadFileGeneric(file, {
        directory: `avatar/${user.id}`,
        returnFullUrl: true,
      });
      //@ts-ignore
      const avatar = result.url;
      if(result.res.status === 200 ) {
        await this.userService.updateAvatar(user.id, avatar);
        if (oldAvatarUrl) {
          await this.ossFileManagementService.deleteFile(oldAvatarUrl);
        }
      }
      return {
        message: '头像更新成功',
        data: {
          avatar
        },
      };
    } catch (error) {
      return {
        code: 500,
        message: '上传头像失败',
        error: error.message,
      };
    }
  }

  @Put('password')
  @ApiOperation({ summary: '更新用户密码' })
  async updatePassword(
    @CurrentUser() user: User,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    await this.userService.updatePassword(user.id, passwordDto);
    return {
      message: '密码更新成功',
    };
  }
}
