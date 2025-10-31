import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';

interface ListCommunitiesOptions {
  crop?: string;
  county?: string;
  take?: number;
}

@Injectable()
export class CommunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  listCommunities(options: ListCommunitiesOptions = {}) {
    return this.prisma.community.findMany({
      where: {
        crop: options.crop
          ? { equals: options.crop, mode: 'insensitive' }
          : undefined,
        county: options.county
          ? { equals: options.county, mode: 'insensitive' }
          : undefined,
      },
      orderBy: { name: 'asc' },
      take: options.take ?? 50,
    });
  }

  async joinCommunity(userId: string, communityId: string) {
    return this.prisma.communityMember.upsert({
      where: {
        communityId_userId: {
          communityId,
          userId,
        },
      },
      update: {},
      create: {
        communityId,
        userId,
      },
    });
  }

  async leaveCommunity(userId: string, communityId: string) {
    await this.prisma.communityMember.delete({
      where: {
        communityId_userId: {
          communityId,
          userId,
        },
      },
    });
  }

  listPosts(communityId: string) {
    return this.prisma.post.findMany({
      where: { communityId },
      include: {
        author: { select: { id: true, profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async createPost(
    userId: string,
    communityId: string,
    content: string,
    media?: string[],
  ) {
    await this.ensureMembership(userId, communityId);
    return this.prisma.post.create({
      data: {
        userId,
        communityId,
        content,
        media,
      },
    });
  }

  async reportPost(userId: string, postId: string, reason: string) {
    await this.ensurePostExists(postId);
    return this.prisma.report.create({
      data: {
        postId,
        reporterId: userId,
        reason,
      },
    });
  }

  async moderatePost(
    actor: RequestUser,
    postId: string,
    action: 'delete' | 'pin',
  ) {
    if (actor.role !== 'ADMIN' && actor.role !== 'INVESTOR') {
      throw new ForbiddenException('Insufficient rights');
    }
    await this.ensurePostExists(postId);
    if (action === 'delete') {
      await this.prisma.post.delete({ where: { id: postId } });
      return { status: 'deleted' };
    }
    if (action === 'pin') {
      return this.prisma.post.update({
        where: { id: postId },
        data: { pinned: true },
      });
    }
    return { status: 'ignored' };
  }

  private async ensureMembership(userId: string, communityId: string) {
    const member = await this.prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId,
          userId,
        },
      },
    });
    if (!member) {
      throw new ForbiddenException('Join community first');
    }
  }

  private async ensurePostExists(postId: string) {
    const exists = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException('Post not found');
    }
  }
}
