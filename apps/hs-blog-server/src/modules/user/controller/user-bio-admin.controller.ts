import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserBioService } from '../service/user-bio.service';
import { CreateUserBioDto, UpdateUserBioDto } from '../dto/user-bio.dto';
import { ApiResponseObject } from '@/common/decorators/api-response.decorator';
import { UserBioVo } from '../vo/user-bio.vo';
import { TransformToVo } from '@/common/decorators/transform-to-vo.decorator';

@ApiTags('admin', '用户生物信息')
@ApiBearerAuth()
@Controller('admin/user-bio')
export class UserBioAdminController {
  constructor(private readonly userBioService: UserBioService) {}

  @ApiOperation({ summary: '创建或更新用户生物信息' })
  @Post()
  async createOrUpdate(@Body() createUserBioDto: CreateUserBioDto) {
    await this.userBioService.createOrUpdate(createUserBioDto);
    return {
      message: '操作成功',
    };
  }

  @ApiOperation({ summary: '获取用户生物信息' })
  @Get()
  @ApiResponseObject(UserBioVo)
  @TransformToVo(UserBioVo)
  async getBio() {
    const result = await this.userBioService.getBio();
    console.log(result, 'result');
    return {
      message: '获取成功',
      data: result,
    };
  }

  @ApiOperation({ summary: '更新用户生物信息' })
  @Put()
  @ApiResponseObject(UserBioVo)
  @TransformToVo(UserBioVo)
  async update(@Body() updateUserBioDto: UpdateUserBioDto) {
    const result = await this.userBioService.update(updateUserBioDto);
    return {
      message: '更新成功',
      data: result,
    };
  }

  @ApiOperation({ summary: '删除用户生物信息' })
  @Delete()
  async remove() {
    await this.userBioService.remove();
    return {
      message: '删除成功',
    };
  }
}
