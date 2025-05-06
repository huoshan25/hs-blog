import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { AuthService } from '@/modules/auth/auth.service';
import { LoginDto, LoginResponseDto } from '@/modules/auth/dto/auth.dto';
import { LoginResponseVo } from '@/modules/user/vo/user.vo';
import { ApiResponseObject } from '@/common/decorators/api-response.decorator';

@ApiTags('admin', '管理员认证')
@Controller('admin/auth')
export class AuthAdminController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '管理员登录' })
  @ApiResponseObject(LoginResponseVo)
  @ApiResponse({ status: 401, description: '认证失败' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.adminLogin(loginDto);
    return {
      message: '登录成功',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      },
    };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiResponseObject(LoginResponseDto)
  async refresh(@Body() refreshTokenDto: { refreshToken: string }) {
    const result = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return {
      message: '刷新成功',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      },
    };
  }
} 