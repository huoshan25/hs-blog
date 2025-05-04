import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '@/modules/user/service/user.service';
import { UserRole } from '@/enum/user-role.enum';

/**
 * 创建管理员账号的脚本
 * 使用方法：npx ts-node -r tsconfig-paths/register src/scripts/create-admin.ts
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userService = app.get(UserService);
    
    // 检查管理员是否已存在
    try {
      const existingAdmin = await userService.findByEmail('admin@example.com');
      if (existingAdmin) {
        console.log('管理员账号已存在，无需创建');
        return;
      }
    } catch (error) {
      // 用户不存在，继续创建
    }

    // 创建管理员账号
    const admin = await userService.create({
      userName: 'admin',
      email: 'admin@example.com',
      password: 'Admin123!', // 应该使用强密码并在首次登录后更改
      role: UserRole.ADMIN,
    });

    console.log('管理员账号创建成功:', {
      id: admin.id,
      userName: admin.userName,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error('创建管理员账号失败:', error);
  } finally {
    await app.close();
  }
}

bootstrap(); 