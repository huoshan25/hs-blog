import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FriendLinkService } from '../service/friend-link.service';
import { UpdateFriendLinkStatusDto } from '../dto/update-friend-link-status.dto';
import { FindFriendLinksDto } from '../dto/find-friend-links.dto';
import { Admin } from '@/modules/auth/decorators/admin.decorator';

@ApiTags('admin', '友链管理')
@Controller('admin/friend-links')
@Admin()
export class FriendLinkAdminController {
  constructor(private readonly friendLinkService: FriendLinkService) {}

  @ApiOperation({ summary: '获取友链' })
  @Get()
  async getFriendLinksAll(@Query() query: FindFriendLinksDto) {
    const result = await this.friendLinkService.findAll(query);
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '获取友链详情' })
  @Get(':id')
  async getFriendLinksAllOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.friendLinkService.findOne(id);
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '更新友链状态（批准/拒绝）' })
  @Post(':id/status')
  async updateFriendLinksAllStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateFriendLinkStatusDto,
  ) {
    await this.friendLinkService.updateStatus(id, updateStatusDto);
    return { message: '更新成功' };
  }

  @ApiOperation({ summary: '删除友链' })
  @Delete(':id')
  async removeFriendLinksAll(@Param('id', ParseIntPipe) id: number) {
    await this.friendLinkService.remove(id);
    return { message: '删除成功' };
  }
}
