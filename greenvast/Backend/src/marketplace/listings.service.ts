import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingStatus } from '@prisma/client';
import { ListingFilterDto } from './dto/listing-filter.dto';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async listListings(
    filters: ListingFilterDto,
    currentUserId?: string,
  ) {
    return this.prisma.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
        crop: filters.crop
          ? { equals: filters.crop, mode: 'insensitive' }
          : undefined,
        grade: filters.grade
          ? { equals: filters.grade, mode: 'insensitive' }
          : undefined,
        farm: filters.county
          ? {
              county: {
                equals: filters.county,
                mode: 'insensitive',
              },
            }
          : undefined,
        ownerId: currentUserId ? { not: currentUserId } : undefined,
      },
      include: {
        farm: true,
        owner: { select: { id: true, role: true, profile: true } },
      },
      skip: filters.skip ?? 0,
      take: filters.take ?? 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getListing(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        farm: true,
        owner: { select: { id: true, profile: true } },
        offers: { include: { buyer: { select: { id: true, profile: true } } } },
      },
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  async createListing(userId: string, dto: CreateListingDto) {
    if (dto.farmId) {
      await this.ensureFarmOwnership(userId, dto.farmId);
    }
    return this.prisma.listing.create({
      data: {
        ownerId: userId,
        farmId: dto.farmId,
        crop: dto.crop,
        grade: dto.grade,
        quantity: dto.quantity,
        pricePerUnit: dto.pricePerUnit,
        unit: dto.unit ?? 'kg',
        openToOffers: dto.openToOffers ?? false,
        description: dto.description,
        media: dto.media ?? [],
        availableFrom: dto.availableFrom
          ? new Date(dto.availableFrom)
          : undefined,
        availableTo: dto.availableTo
          ? new Date(dto.availableTo)
          : undefined,
      },
    });
  }

  async updateListing(
    userId: string,
    listingId: string,
    dto: UpdateListingDto,
  ) {
    const listing = await this.ensureListingOwnership(userId, listingId);
    if (dto.farmId && dto.farmId !== listing.farmId) {
      await this.ensureFarmOwnership(userId, dto.farmId);
    }
    return this.prisma.listing.update({
      where: { id: listingId },
      data: {
        ...dto,
        availableFrom: dto.availableFrom
          ? new Date(dto.availableFrom)
          : undefined,
        availableTo: dto.availableTo
          ? new Date(dto.availableTo)
          : undefined,
      },
    });
  }

  async archiveListing(userId: string, listingId: string) {
    await this.ensureListingOwnership(userId, listingId);
    return this.prisma.listing.update({
      where: { id: listingId },
      data: { status: ListingStatus.ARCHIVED },
    });
  }

  private async ensureListingOwnership(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, ownerId: true, farmId: true },
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.ownerId !== userId) {
      throw new ForbiddenException('Not allowed to modify this listing');
    }
    return listing;
  }

  private async ensureFarmOwnership(userId: string, farmId: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id: farmId },
      select: { userId: true },
    });
    if (!farm) {
      throw new NotFoundException('Farm not found');
    }
    if (farm.userId !== userId) {
      throw new ForbiddenException('Farm not owned by user');
    }
  }
}
