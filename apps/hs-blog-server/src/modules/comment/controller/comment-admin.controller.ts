import { Controller, Delete, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from '../service/comment.service';
import { CommentQueryDto } from '../dto/comment-query.dto';

@ApiTags('admin', '评论管理')
@Controller('admin/comments')
export class CommentAdminController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: '获取评论列表' })
  @ApiResponse({ status: 200, description: '返回评论列表' })
  async findAll(@Query() queryDto: CommentQueryDto) {
    const result = await this.commentService.findAll(queryDto);
    return {
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评论' })
  @ApiParam({ name: 'id', description: '评论ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.commentService.adminRemove(id);
    return { message: '评论删除成功' };
  }
} 