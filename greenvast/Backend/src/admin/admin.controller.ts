import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CommunitiesService } from '../communities/communities.service';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Admin')
@ApiBearerAuth('firebase')
@UseGuards(FirebaseAuthGuard)
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(
    private readonly communitiesService: CommunitiesService,
    private readonly prisma: PrismaService,
  ) {}

  private ensureAdmin(user: RequestUser) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admins only');
    }
  }

  @Get('reports')
  getReports(@CurrentUser() user: RequestUser) {
    this.ensureAdmin(user);
    return this.prisma.report.findMany({
      include: {
        post: { include: { community: true, author: { select: { profile: true } } } },
        reporter: { select: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @Post('posts/:postId/pin')
  pinPost(
    @CurrentUser() user: RequestUser,
    @Param('postId') postId: string,
  ) {
    this.ensureAdmin(user);
    return this.communitiesService.moderatePost(user, postId, 'pin');
  }

  @Delete('posts/:postId')
  deletePost(
    @CurrentUser() user: RequestUser,
    @Param('postId') postId: string,
  ) {
    this.ensureAdmin(user);
    return this.communitiesService.moderatePost(user, postId, 'delete');
  }

  @Get('analytics/summary')
  async analytics(@CurrentUser() user: RequestUser) {
    this.ensureAdmin(user);
    const [users, farms, listings, communities, loans] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.farm.count(),
        this.prisma.listing.count(),
        this.prisma.community.count(),
        this.prisma.loan.count(),
      ]);
    return {
      users,
      farms,
      listings,
      communities,
      loans,
    };
  }
}
