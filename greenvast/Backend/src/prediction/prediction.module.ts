import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [PredictionController],
  providers: [PredictionService],
  exports: [PredictionService],
})
export class PredictionModule {}
