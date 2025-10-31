import { Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { PostsController } from './posts.controller';

@Module({
  providers: [CommunitiesService],
  controllers: [CommunitiesController, PostsController],
  exports: [CommunitiesService],
})
export class CommunitiesModule {}
