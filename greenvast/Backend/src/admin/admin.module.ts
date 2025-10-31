import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { CommunitiesModule } from '../communities/communities.module';

@Module({
  imports: [CommunitiesModule],
  controllers: [AdminController],
})
export class AdminModule {}
