import { Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { PostsController } from './posts.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CommunitiesService],
  controllers: [CommunitiesController, PostsController],
  exports: [CommunitiesService],
})
export class CommunitiesModule {}
