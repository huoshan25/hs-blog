import { Controller, Get } from '@nestjs/common';
import { TagService } from '../service/tag.service';
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('admin','标签管理')
@ApiBearerAuth()
@Controller('admin/tag')
export class TagAdminController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '标签统计'})
  @Get('stats')
  async getTagsStats() {
    const data = await this.tagService.getTagsStats();
    return { data };
  }

  @ApiOperation({ summary: '标签趋势' })
  @Get('trend')
  async getTagsTrend() {
    const data = await this.tagService.getTagsTrend();
    return { data };
  }

  @ApiOperation({ summary: '标签关系' })
  @Get('relation')
  async getTagsRelation() {
    const data = await this.tagService.getTagsRelation();
    return { data };
  }
}
