import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FriendLinkService } from '../service/friend-link.service';
import { UpdateFriendLinkStatusDto } from '../dto/update-friend-link-status.dto';

@ApiTags('admin', '友链管理')
@Controller('admin/friend-links')
export class FriendLinkAdminController {
  constructor(private readonly friendLinkService: FriendLinkService) {}

  @ApiOperation({ summary: '获取所有友链' })
  @Get()
  async getAll() {
    const result = await this.friendLinkService.findAll();
    return {
      data: result,
    }
  }

  @ApiOperation({ summary: '获取友链详情' })
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.friendLinkService.findOne(id);
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '更新友链状态（批准/拒绝）' })
  @Post(':id/status')
  @UsePipes(new ValidationPipe())
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateFriendLinkStatusDto,
  ) {
    await this.friendLinkService.updateStatus(id, updateStatusDto);
    return { message: '更新成功' };
  }

  @ApiOperation({ summary: '删除友链' })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.friendLinkService.remove(id);
    return { message: '删除成功' };
  }
}
