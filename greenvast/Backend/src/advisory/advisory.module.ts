import { Module } from '@nestjs/common';
import { AdvisoryService } from './advisory.service';
import { AdvisoryController } from './advisory.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 2,
    }),
  ],
  providers: [AdvisoryService],
  controllers: [AdvisoryController],
  exports: [AdvisoryService],
})
export class AdvisoryModule {}
