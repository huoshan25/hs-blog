import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UrlPreviewService } from './url-preview.service';
import { UrlPreviewRequestDto } from './dto/url-preview.dto';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Public} from "@/modules/auth/decorators/public.decorator";

@ApiTags('blog', '链接预览')
@Controller('blog/url-preview')
@UseInterceptors(CacheInterceptor)
export class UrlPreviewController {
  constructor(private readonly urlPreviewService: UrlPreviewService) {}

  @ApiOperation({summary: '获取链接预览'})
  @Get()
  @Public()
  async getPreview(@Query(ValidationPipe) query: UrlPreviewRequestDto) {
    const result = await this.urlPreviewService.getPreview(query.url);
    return { data: result };
  }
}
