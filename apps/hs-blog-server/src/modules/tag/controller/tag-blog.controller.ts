import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { TagService } from '../service/tag.service';
import { GetArticlesByTagDto } from '../dto/get-articles-by-tag.dto';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('blog', '标签模块')
@Public()
@Controller('blog/tag')
export class TagBlogController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '获取标签下的文章' })
  @Get('articles')
  async getArticlesByTagName(
    @Query(ValidationPipe) getArticlesDto: GetArticlesByTagDto,
  ) {
    const { data } = await this.tagService.getArticlesByTagName(
      getArticlesDto.tagName,
      getArticlesDto.page,
      getArticlesDto.limit,
    );

    return { data };
  }

  @ApiOperation({ summary: '获取所有标签' })
  @Get()
  async getAllTags() {
    const [list, total] = await this.tagService.getAllTags();
    const data = {
      list,
      total,
    };
    return { data };
  }

  @ApiOperation({ summary: '搜索标签' })
  @Get('search')
  async getArticleCount(@Query('keyword') keyword: string) {
    const data = await this.tagService.searchTags(keyword);
    return { data };
  }
}
