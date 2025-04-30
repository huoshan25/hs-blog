import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullConfig } from './bull.config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (bullConfig: BullConfig) => bullConfig.createBullOptions(),
      inject: [BullConfig],
    }),
  ],
  providers: [BullConfig],
  exports: [BullModule, BullConfig],
})
export class BullRootModule {}
