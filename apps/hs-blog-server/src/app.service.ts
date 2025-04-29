import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  public readonly test: string;

  constructor(
    private configService: ConfigService
  ) {
    this.test = this.configService.get('test');
  }

  getHello(): string {
    return `Hello World! ${this.test}`;
  }
}
