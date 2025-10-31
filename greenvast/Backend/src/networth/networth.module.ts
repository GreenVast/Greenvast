import { Module } from '@nestjs/common';
import { NetworthService } from './networth.service';
import { NetworthController } from './networth.controller';
import { MarketsModule } from '../markets/markets.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MarketsModule, AuthModule],
  controllers: [NetworthController],
  providers: [NetworthService],
})
export class NetworthModule {}
