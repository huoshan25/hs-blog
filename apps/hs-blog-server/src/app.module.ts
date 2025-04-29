import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {NestConfigModule} from "./config/config.module";

@Module({
  imports: [
    NestConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
