import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ArticleService } from '@/modules/article/service/article.service';
import { CursorArticlesDto } from '@/modules/article/dto/cursor-articles.dto';
import { SearchArticleDto } from '@/modules/article/dto/search-article.dto';
import { ArticleSearchResponseVO } from '@/modules/article/vo/article-search-response.vo';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('blog', '文章模块')
@Public()
@Controller('blog/article')
export class ArticleBlogController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: '获取文章列表' })
  @Get('list')
  async findPublicArticles(@Query(ValidationPipe) query: CursorArticlesDto) {
    const { list, cursor, hasMore } =
      await this.articleService.findPublicArticles(query);
    return {
      data: {
        list,
        cursor,
        hasMore,
      },
    };
  }

  @ApiOperation({ summary: '搜索文章' })
  @Get('search-select')
  async searchArticleSelect(
    @Query(ValidationPipe) searchArticleDto: SearchArticleDto,
  ) {
    const result =
      await this.articleService.searchArticlesSelect(searchArticleDto);
    const data = result.map((article) => ({
      id: article.id,
      title: article.title,
    }));
    return {
      data,
    };
  }

  @ApiOperation({ summary: '搜索文章' })
  @Get('search')
  async searchArticles(
    @Query(ValidationPipe) searchArticleDto: SearchArticleDto,
  ) {
    const result = await this.articleService.searchArticles(searchArticleDto);
    const data = result.map((article) =>
      plainToClass(ArticleSearchResponseVO, article, {
        excludeExtraneousValues: true,
      }),
    );
    return {
      data,
    };
  }

  @ApiOperation({ summary: '获取所有标签' })
  @Get('tags')
  async findAllTags() {
    const { tag_list, tag_total, article_total } =
      await this.articleService.findAllTags();
    return {
      data: {
        tag_list,
        tag_total,
        article_total,
      },
    };
  }

  @ApiOperation({ summary: '获取文章详情' })
  @Get('details')
  async articleDetails(@Query('id') id: number) {
    return await this.articleService.articleDetails(id);
  }

  @ApiOperation({ summary: '获取文章详情' })
  @Get('sitemap-info')
  async findHotArticles() {
    const result = await this.articleService.getAllArticleIds();
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '文章浏览量' })
  @Get('view-count')
  async viewCount(@Query('id') id: number) {
    const result = await this.articleService.addViewCount(id);
    return {
      data: result,
    };
  }
}
