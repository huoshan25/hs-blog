import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  ParseIntPipe, 
  Post, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from '../service/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';

@ApiTags('评论')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建评论' })
  @ApiResponse({ status: 201, description: '评论创建成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentService.create(createCommentDto, req.user);
  }

  @Get('article/:articleId')
  @ApiOperation({ summary: '获取文章评论列表' })
  @ApiParam({ name: 'articleId', description: '文章ID' })
  @ApiResponse({ status: 200, description: '返回评论列表' })
  async findByArticleId(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.commentService.findByArticleId(articleId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除评论' })
  @ApiParam({ name: 'id', description: '评论ID' })
  @ApiResponse({ status: 200, description: '评论删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.commentService.remove(id, req.user);
    return { message: '评论删除成功' };
  }
} 