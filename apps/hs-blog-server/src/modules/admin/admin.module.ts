import { Module } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
  ],
  controllers: [AdminController],
  providers: [],
})
export class AdminModule {} 