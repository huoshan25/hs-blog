import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@/enum/user-role.enum';

@Injectable()
export class UserConfigService {
  private readonly initAdminUser: CreateUserDto;

  constructor(private configService: ConfigService) {
    this.initAdminUser = {
      email: this.configService.get('ADMIN_EMAIL'),
      password: this.configService.get('ADMIN_PASSWORD'),
      role: UserRole.ADMIN,
      userName: this.configService.get('ADMIN_USERNAME'),
    };
  }

  get adminUserConfig() {
    return this.initAdminUser;
  }
}