import { Controller, Delete, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from '../service/comment.service';
import { CommentQueryDto } from '../dto/comment-query.dto';

@ApiTags('管理员-评论管理')
@Controller('admin/comments')
export class CommentAdminController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: '管理员获取评论列表' })
  @ApiResponse({ status: 200, description: '返回评论列表' })
  async findAll(@Query() queryDto: CommentQueryDto) {
    return this.commentService.findAll(queryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '管理员删除评论' })
  @ApiParam({ name: 'id', description: '评论ID' })
  @ApiResponse({ status: 200, description: '评论删除成功' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.commentService.adminRemove(id);
    return { message: '评论删除成功' };
  }
} 