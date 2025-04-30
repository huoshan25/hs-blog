import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {Public} from './decorators/public.decorator';
import {LoginDto, LoginResponseDto, RefreshTokenDto, RegisterDto,} from './dto/auth.dto';
import {SendEmailCodeDto, VerifyEmailCodeDto} from './dto/email-code.dto';
import {ApiResponseObject} from '@/common/decorators/api-response.decorator';
import {LoginResponseVo, registerResVo} from '@/modules/user/vo/user.vo';

/**
 * 认证控制器
 * 处理认证相关的 HTTP 请求
 */
@ApiTags('web', '认证')
@Controller('web/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Public()
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @HttpCode(HttpStatus.OK)
  @ApiResponseObject(registerResVo)
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

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponseObject(LoginResponseVo)
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

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiResponseObject(LoginResponseDto)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
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
