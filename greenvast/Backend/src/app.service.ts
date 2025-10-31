import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'GreenVast API',
      env: this.configService.get<string>('app.env'),
      time: dayjs().toISOString(),
    };
  }
}
