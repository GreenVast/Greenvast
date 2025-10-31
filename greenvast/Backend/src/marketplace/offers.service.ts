import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferStatus } from '@prisma/client';
import { UpdateOfferStatusDto } from './dto/update-offer-status.dto';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async listOffersForListing(listingId: string) {
    return this.prisma.offer.findMany({
      where: { listingId },
      include: { buyer: { select: { id: true, profile: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOffer(userId: string, dto: CreateOfferDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      select: { id: true, ownerId: true, openToOffers: true },
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.ownerId === userId) {
      throw new ForbiddenException('Cannot offer on own listing');
    }
    if (!listing.openToOffers && dto.pricePerUnit == null) {
      throw new ForbiddenException('Listing requires a price offer');
    }

    return this.prisma.offer.create({
      data: {
        listingId: dto.listingId,
        buyerId: userId,
        pricePerUnit: dto.pricePerUnit,
        quantity: dto.quantity,
        message: dto.message,
      },
    });
  }

  async updateOfferStatus(
    userId: string,
    offerId: string,
    dto: UpdateOfferStatusDto,
  ) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: { listing: true },
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    if (offer.listing.ownerId !== userId) {
      throw new ForbiddenException('Only listing owner can update offer');
    }

    return this.prisma.offer.update({
      where: { id: offerId },
      data: { status: dto.status },
    });
  }

  async cancelOffer(userId: string, offerId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    if (offer.buyerId !== userId) {
      throw new ForbiddenException('Cannot cancel another buyer offer');
    }
    if (offer.status !== OfferStatus.PENDING) {
      throw new ForbiddenException('Offer already processed');
    }

    return this.prisma.offer.update({
      where: { id: offerId },
      data: { status: OfferStatus.WITHDRAWN },
    });
  }
}
