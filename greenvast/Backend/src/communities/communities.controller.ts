import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommunitiesService } from './communities.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';

@ApiTags('Communities')
@Controller({ path: 'communities', version: '1' })
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get()
  listCommunities(
    @Query('crop') crop?: string,
    @Query('county') county?: string,
  ) {
    return this.communitiesService.listCommunities({ crop, county });
  }

  @Post(':communityId/join')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  joinCommunity(
    @CurrentUser() user: RequestUser,
    @Param('communityId') communityId: string,
  ) {
    return this.communitiesService.joinCommunity(user.userId!, communityId);
  }

  @Delete(':communityId/leave')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  leaveCommunity(
    @CurrentUser() user: RequestUser,
    @Param('communityId') communityId: string,
  ) {
    return this.communitiesService.leaveCommunity(user.userId!, communityId);
  }
}
