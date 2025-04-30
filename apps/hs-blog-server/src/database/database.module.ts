import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './database.config';
import { TransactionService } from '@/database/transaction.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = new DatabaseConfig(configService);
        return dbConfig.config;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseConfig, TransactionService ],
  exports: [DatabaseConfig, TransactionService ],
})
export class DatabaseModule {}
