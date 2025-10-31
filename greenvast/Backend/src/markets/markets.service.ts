import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import dayjs from 'dayjs';

export interface WeeklyPriceResponse {
  commodity: string;
  market: string;
  weeklyPrice: number | null;
  unit: string | null;
  updatedAt: string | null;
}

@Injectable()
export class MarketsService {
  private readonly logger = new Logger(MarketsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async listMarkets() {
    return this.prisma.market.findMany({
      orderBy: [{ county: 'asc' }, { name: 'asc' }],
    });
  }

  async getWeeklyPrice(
    commodity: string,
    marketName?: string,
  ): Promise<WeeklyPriceResponse> {
    const market = marketName
      ? await this.prisma.market.findFirst({
          where: { name: { equals: marketName, mode: 'insensitive' } },
        })
      : null;

    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate();

    const snapshots = await this.prisma.priceSnapshot.findMany({
      where: {
        commodity: { equals: commodity, mode: 'insensitive' },
        marketId: market?.id,
        date: { gte: sevenDaysAgo },
      },
      orderBy: { date: 'desc' },
      include: { market: true },
    });

    if (snapshots.length === 0) {
      return {
        commodity,
        market: marketName ?? '',
        weeklyPrice: null,
        unit: null,
        updatedAt: null,
      };
    }

    const prices = snapshots.map((snapshot) =>
      Number(snapshot.medianPrice ?? 0),
    );
    const sorted = prices.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    const latest = snapshots[0];

    return {
      commodity,
      market: latest.market?.name ?? marketName ?? '',
      weeklyPrice: Math.round(median * 100) / 100,
      unit: latest.unit,
      updatedAt: latest.date.toISOString(),
    };
  }

  async upsertPriceSnapshot(payload: {
    commodity: string;
    marketId: string;
    date: Date;
    medianPrice: number;
    unit: string;
  }) {
    return this.prisma.priceSnapshot.upsert({
      where: {
        commodity_marketId_date: {
          commodity: payload.commodity,
          marketId: payload.marketId,
          date: payload.date,
        },
      },
      update: {
        medianPrice: new Decimal(payload.medianPrice),
        unit: payload.unit,
      },
      create: {
        commodity: payload.commodity,
        marketId: payload.marketId,
        date: payload.date,
        medianPrice: payload.medianPrice,
        unit: payload.unit,
      },
    });
  }

  async ensureMarket(payload: {
    name: string;
    county: string;
    latitude?: number;
    longitude?: number;
  }) {
    const market = await this.prisma.market.upsert({
      where: { name: payload.name },
      update: {
        county: payload.county,
        latitude: payload.latitude,
        longitude: payload.longitude,
      },
      create: {
        name: payload.name,
        county: payload.county,
        latitude: payload.latitude,
        longitude: payload.longitude,
      },
    });
    return market;
  }

  async seedMarkets(markets: Array<{
    name: string;
    county: string;
    latitude?: number;
    longitude?: number;
  }>) {
    for (const market of markets) {
      await this.ensureMarket(market);
    }
    this.logger.log(`Seeded ${markets.length} markets`);
  }
}
