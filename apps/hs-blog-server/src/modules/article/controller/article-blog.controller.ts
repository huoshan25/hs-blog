import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ArticleService } from '@/modules/article/service/article.service';
import { CursorArticlesDto } from '@/modules/article/dto/cursor-articles.dto';
import { SearchArticleDto } from '@/modules/article/dto/search-article.dto';
import { ArticleSearchResponseVO } from '@/modules/article/vo/article-search-response.vo';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleLikeService } from '../service/article-like.service';
import { ArticleLikeDto } from '../dto/article-like.dto';
import { User } from '@/modules/user/entities/user.entity';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';

@ApiTags('blog', '文章模块')
@ApiBearerAuth()
@Controller('blog/article')
export class ArticleBlogController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly articleLikeService: ArticleLikeService,
  ) {}

  @ApiOperation({ summary: '获取文章列表' })
  @Get('list')
  @Public()
  async findPublicArticles(
    @CurrentUser() user: User,
    @Query(ValidationPipe) query: CursorArticlesDto,
  ) {
    const { list, cursor, hasMore } =
      await this.articleService.findPublicArticles(query, user.id);
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
  @Public()
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
  @Public()
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
  @Public()
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
  @Public()
  async articleDetails(@Query('id') id: number) {
    if (!id || isNaN(id)) {
      return {
        data: null,
        message: '无效的文章ID'
      };
    }
    
    const result = await this.articleService.articleDetails(id);
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '获取文章详情' })
  @Get('sitemap-info')
  @Public()
  async findHotArticles() {
    const result = await this.articleService.getAllArticleIds();
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '文章浏览量' })
  @Get('view-count')
  @Public()
  async viewCount(@Query('id') id: number) {
    if (!id || isNaN(id)) {
      return {
        data: null,
        message: '无效的文章ID'
      };
    }
    
    const result = await this.articleService.addViewCount(id);
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '点赞或取消点赞文章' })
  @Post('like/toggle')
  @ApiBearerAuth()
  async toggleLike(
    @Body() articleLikeDto: ArticleLikeDto,
    @CurrentUser() user: User,
  ) {
    const result = await this.articleLikeService.toggleLike(
      articleLikeDto.articleId,
      user,
    );
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '获取文章点赞状态' })
  @Get('like/status')
  @Public()
  async getLikeStatusForUser(
    @Query('articleId') articleId: number,
    @CurrentUser() user: User,
  ) {
    if (!articleId || isNaN(articleId)) {
      return {
        data: {
          liked: false,
          likeCount: 0
        }
      };
    }

    const userId = user?.id || 0;
    
    const result = await this.articleLikeService.getLikeStatus(
      articleId,
      userId,
    );
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '获取用户点赞的文章列表' })
  @Get('like/user-liked')
  async getUserLikedArticles(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!user || !user.id) {
      return {
        data: {
          items: [],
          total: 0,
          page,
          limit
        }
      };
    }
    
    const result = await this.articleLikeService.getUserLikedArticles(
      user.id,
      page,
      limit,
    );
    return {
      data: result,
    };
  }
}
