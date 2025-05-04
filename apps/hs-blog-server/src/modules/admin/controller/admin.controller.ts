import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Admin } from '@/modules/auth/decorators/admin.decorator';

@ApiTags('admin', '管理员平台')
@Controller('admin')
export class AdminController {
  
  @Get('dashboard')
  @Admin()
  @ApiOperation({ summary: '获取管理员仪表盘数据' })
  @ApiResponse({ status: 200, description: '成功获取仪表盘数据' })
  async getDashboard() {
    // 这里实现获取仪表盘数据的逻辑
    return {
      message: '获取仪表盘数据成功',
      data: {
        blogStats: {
          totalArticles: 100,
          totalViews: 5000,
          totalComments: 300,
        },
        recentComments: [
          { id: 1, content: '评论内容示例1', createdAt: new Date() },
          { id: 2, content: '评论内容示例2', createdAt: new Date() },
        ],
      },
    };
  }
  
  @Get('profile')
  @Admin()
  @ApiOperation({ summary: '获取管理员个人信息' })
  @ApiResponse({ status: 200, description: '成功获取管理员信息' })
  async getAdminProfile() {
    return {
      message: '获取管理员信息成功',
      data: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        lastLogin: new Date(),
      },
    };
  }
}