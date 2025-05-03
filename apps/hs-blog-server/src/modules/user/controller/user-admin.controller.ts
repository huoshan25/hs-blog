import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '@/modules/user/service/profile.service';
import { UpdateProfileDto } from '@/modules/user/dto/profile.dto';

@ApiTags('admin', '用户模块')
@ApiBearerAuth()
@Controller('admin/user')
export class UserAdminController {
  constructor(private readonly profileService: ProfileService) {}

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
}
