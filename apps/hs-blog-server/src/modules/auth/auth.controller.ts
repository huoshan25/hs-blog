import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RequireAuth } from './decorators/require-auth.decorator';
import { LoginDto, LoginResponseDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';
import { SendEmailCodeDto, VerifyEmailCodeDto } from './dto/email-code.dto';

/**
 * 认证控制器
 * 处理认证相关的 HTTP 请求
 */
@ApiTags('web', '认证')
@Controller('web/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 发送邮箱验证码接口
   * @param dto 包含邮箱信息的请求体
   * @returns 发送验证码的结果
   */
  @Public()
  @Post('send-code')
  @ApiOperation({ summary: '发送邮箱验证码' })
  async sendEmailCode(@Body() dto: SendEmailCodeDto) {
    const result = await this.authService.sendEmailCode(dto.email);
    return {
      message: '验证码发送成功',
      data: result,
    };
  }

  /**
   * 验证邮箱验证码接口
   * @param dto 包含邮箱和验证码信息的请求体
   * @returns 验证结果
   */
  @Public()
  @Post('verify-code')
  @ApiOperation({ summary: '验证邮箱验证码' })
  async verifyEmailCode(@Body() dto: VerifyEmailCodeDto) {
    const result = await this.authService.verifyEmailCode(dto.email, dto.code);
    return {
      message: '验证成功',
      data: result,
    };
  }

  /**
   * 用户注册接口
   * @param dto 包含用户注册信息的请求体
   * @returns 注册结果
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: '注册成功',
    type: LoginResponseDto,
  })
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return {
      message: '注册成功',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
  }

  /**
   * 用户登录接口
   * @param dto 包含登录信息的请求体
   * @returns 访问令牌和刷新令牌
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录', description: '使用用户名和密码登录系统' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: '登录失败' })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return {
      message: '登录成功',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
  }

  /**
   * 刷新令牌接口
   * @param refreshTokenDto 包含刷新令牌的请求体
   * @returns 新的访问令牌和刷新令牌
   */
  @Public()
  @Post('refresh')
  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiResponse({
    status: 200,
    description: '刷新成功',
    type: LoginResponseDto,
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
