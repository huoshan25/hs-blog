import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FriendLinkService } from '../service/friend-link.service';
import { CreateFriendLinkDto } from '../dto/create-friend-link.dto';
import { FriendLink } from '../entities/friend-link.entity';
import { Public } from '@/modules/auth/decorators/public.decorator';

@ApiTags('前台-友链')
@Public()
@Controller('blog/friend-links')
export class FriendLinkBlogController {
  constructor(private readonly friendLinkService: FriendLinkService) {}

  @ApiOperation({ summary: '获取所有已批准的友链' })
  @Get()
  async getAllApproved() {
    const result = await this.friendLinkService.findAllApproved();
    return {
      data: result,
    }
  }

  @ApiOperation({ summary: '申请友链' })
  @Post('apply')
  @UsePipes(new ValidationPipe())
  async applyFriendLink(@Body() createFriendLinkDto: CreateFriendLinkDto) {
    // 检查是否已存在
    const exists = await this.friendLinkService.checkExists(createFriendLinkDto.url);
    if (exists) {
      return { message: '该网站已申请过友链，请勿重复提交' };
    }
    
    await this.friendLinkService.create(createFriendLinkDto);
    return { message: '友链申请已提交，请耐心等待审核' };
  }
} 