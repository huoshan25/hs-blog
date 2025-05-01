import { ConfigModule } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';
import { TTSConfigService } from './service/tts-config.service';
import { TTSService } from './service/tts.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [],
  providers: [TTSConfigService, TTSService, Logger],
  exports: [TTSService]
})
export class TtsModule {}