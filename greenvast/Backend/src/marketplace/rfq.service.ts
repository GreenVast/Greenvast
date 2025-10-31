import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { RfqFilterDto } from './dto/rfq-filter.dto';
import { RespondRfqDto } from './dto/respond-rfq.dto';

@Injectable()
export class RfqService {
  constructor(private readonly prisma: PrismaService) {}

  listRfqs(filters: RfqFilterDto) {
    return this.prisma.requestForQuote.findMany({
      where: {
        crop: filters.crop
          ? { equals: filters.crop, mode: 'insensitive' }
          : undefined,
        county: filters.county
          ? { equals: filters.county, mode: 'insensitive' }
          : undefined,
      },
      include: {
        farmer: { select: { id: true, profile: true } },
        listings: { include: { listing: true } },
        responses: {
          include: { responder: { select: { profile: true } } },
        },
      },
      skip: filters.skip ?? 0,
      take: filters.take ?? 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRfq(userId: string, dto: CreateRfqDto) {
    if (dto.farmId) {
      const farm = await this.prisma.farm.findUnique({
        where: { id: dto.farmId },
        select: { userId: true },
      });
      if (!farm || farm.userId !== userId) {
        throw new ForbiddenException('Farm not owned by user');
      }
    }

    return this.prisma.requestForQuote.create({
      data: {
        userId,
        farmId: dto.farmId,
        crop: dto.crop,
        grade: dto.grade,
        quantity: dto.quantity,
        unit: dto.unit ?? 'kg',
        county: dto.county,
        notes: dto.notes,
      },
    });
  }

  async respondToRfq(
    userId: string,
    rfqId: string,
    dto: RespondRfqDto,
  ) {
    const rfq = await this.prisma.requestForQuote.findUnique({
      where: { id: rfqId },
    });
    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    const response = await this.prisma.marketResponse.create({
      data: {
        rfqId,
        userId,
        message: dto.message,
      },
    });

    if (dto.listingId) {
      await this.prisma.requestForQuoteListing.upsert({
        where: {
          rfqId_listingId: {
            rfqId,
            listingId: dto.listingId,
          },
        },
        update: {},
        create: {
          rfqId,
          listingId: dto.listingId,
        },
      });
    }

    return response;
  }
}
