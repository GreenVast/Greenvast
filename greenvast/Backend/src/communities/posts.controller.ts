import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommunitiesService } from './communities.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { ReportPostDto } from './dto/report-post.dto';

@ApiTags('CommunityPosts')
@Controller({ path: 'communities', version: '1' })
export class PostsController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get(':communityId/posts')
  listPosts(@Param('communityId') communityId: string) {
    return this.communitiesService.listPosts(communityId);
  }

  @Post(':communityId/posts')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  createPost(
    @CurrentUser() user: RequestUser,
    @Param('communityId') communityId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.communitiesService.createPost(
      user.userId!,
      communityId,
      dto.content,
      dto.media,
    );
  }

  @Post('posts/:postId/report')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  reportPost(
    @CurrentUser() user: RequestUser,
    @Param('postId') postId: string,
    @Body() dto: ReportPostDto,
  ) {
    return this.communitiesService.reportPost(user.userId!, postId, dto.reason);
  }
}
