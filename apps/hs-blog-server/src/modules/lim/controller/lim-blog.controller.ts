import { Body, Controller, Header, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LimService } from '@/modules/lim/service/lim.service';
import { Public } from '@/modules/auth/decorators/public.decorator';

@ApiTags('blog', '大模型应用')
@Public()
@Controller('blog/openai')
export class LimBlogController {
  constructor(
    private readonly limService: LimService,
  ) {}

  @Post('chat')
  async chat() {
    const result = await this.limService.chat();

    return {
      data: result,
    };
  }

  @ApiOperation({ summary: '代码分析' })
  @Post('analyze-code')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  async analyzeCode(
    @Res() res: Response,
    @Body()
    body: {
      code: string;
      language: string;
    },
  ) {
    try {
      const stream = await this.limService.analyzeCodeStream(
        body.code,
        body.language,
      );

      // 检测客户端断开连接
      res.on('close', () => {
        stream.controller?.abort();
        res.end();
      });

      for await (const chunk of stream) {
        // 检查连接是否已关闭
        if (res.closed) {
          break;
        }

        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      console.error('Stream error:', error);
      res.write(`data: ${JSON.stringify({ error: '分析出错' })}\n\n`);
      res.end();
    }
  }
}
