import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { firebaseUid: dto.firebaseUid },
      include: { profile: true },
    });
    if (existing) {
      return existing;
    }

    return this.prisma.user.create({
      data: {
        firebaseUid: dto.firebaseUid,
        role: dto.role ?? UserRole.FARMER,
        phoneNumber: dto.phoneNumber,
        profile: dto.name
          ? {
              create: {
                name: dto.name,
              },
            }
          : undefined,
      },
      include: { profile: true },
    });
  }

  async getByFirebaseUid(firebaseUid: string) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        profile: true,
        consents: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true, consents: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.ensureUser(userId);

    const location =
      dto.location !== undefined
        ? {
            lat: dto.location?.lat ?? null,
            lng: dto.location?.lng ?? null,
          }
        : undefined;

    const updateData: Prisma.ProfileUpdateInput = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.county !== undefined) updateData.county = dto.county;
    if (dto.subCounty !== undefined) updateData.subCounty = dto.subCounty;
    if (dto.language !== undefined) updateData.language = dto.language;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;
    if (dto.bio !== undefined) updateData.bio = dto.bio;
    if (dto.crops !== undefined) updateData.crops = dto.crops;
    if (location !== undefined) updateData.location = location as Prisma.InputJsonValue;

    return this.prisma.profile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        name: dto.name ?? 'Unnamed Farmer',
        county: dto.county,
        subCounty: dto.subCounty,
        language: dto.language ?? 'en',
        avatarUrl: dto.avatarUrl,
        bio: dto.bio,
        location: location as Prisma.InputJsonValue,
        crops: dto.crops ?? [],
      },
    });
  }

  async upsertConsent(
    userId: string,
    payload: { dataSharing?: boolean; analytics?: boolean },
  ) {
    await this.ensureUser(userId);
    return this.prisma.consent.upsert({
      where: { userId },
      update: {
        dataSharing: payload.dataSharing ?? false,
        analytics: payload.analytics ?? false,
      },
      create: {
        userId,
        dataSharing: payload.dataSharing ?? false,
        analytics: payload.analytics ?? false,
      },
    });
  }

  async exportUserData(userId: string) {
    await this.ensureUser(userId);
    return this.prisma.$transaction(async (tx) => {
      const [
        user,
        farms,
        listings,
        loans,
        advisories,
        priceViews,
        communities,
        posts,
        netWorth,
      ] = await Promise.all([
        tx.user.findUnique({
          where: { id: userId },
          include: { profile: true, consents: true },
        }),
        tx.farm.findMany({
          where: { userId },
          include: {
            parcels: true,
            crops: true,
            livestock: true,
            inventoryLots: true,
            advisories: true,
            weatherHistory: true,
          },
        }),
        tx.listing.findMany({
          where: { ownerId: userId },
          include: { offers: true },
        }),
        tx.loan.findMany({
          where: { userId },
          include: { repayments: true },
        }),
        tx.advisory.findMany({
          where: { farm: { userId } },
        }),
        tx.priceSnapshot.findMany({
          take: 50,
          orderBy: { date: 'desc' },
        }),
        tx.communityMember.findMany({
          where: { userId },
          include: { community: true },
        }),
        tx.post.findMany({
          where: { userId },
        }),
        tx.netWorthRecord.findMany({
          where: { userId },
          orderBy: { computedAt: 'desc' },
        }),
      ]);

      return {
        user,
        farms,
        listings,
        loans,
        advisories,
        priceSnapshots: priceViews,
        communities,
        posts,
        netWorth,
      };
    });
  }

  async deleteUser(userId: string) {
    await this.ensureUser(userId);
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  private async ensureUser(userId: string) {
    const exists = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException('User not found');
    }
  }
}
