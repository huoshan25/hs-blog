import { IsBoolean, IsNumber, IsString, IsUrl } from 'class-validator';

/**
 * 邮件配置
 */
export class EmailConfigDto {
  @IsString()
  alias: string;

  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsBoolean()
  secure: boolean;

  @IsString()
  user: string;

  @IsString()
  pass: string;

  @IsString()
  appName: string;

  @IsUrl()
  appUrl: string;

  @IsString()
  appDescription: string;

  @IsUrl()
  appLogoUrl: string;
}
