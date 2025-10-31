import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { MarketsService } from '../markets/markets.service';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs';

interface KamisRecord {
  commodity: string;
  market: string;
  unit: string;
  price: number;
  date: string;
}

@Injectable()
export class KamisService {
  private readonly logger = new Logger(KamisService.name);

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
    private readonly marketsService: MarketsService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM, {
    timeZone: 'Africa/Nairobi',
  })
  async scheduledIngest() {
    await this.ingestLatestPrices();
  }

  async ingestLatestPrices(date = new Date()) {
    try {
      const records = await this.fetchPriceData(date);
      const grouped = this.computeWeeklyMedian(records);

      for (const record of grouped) {
        const market = await this.marketsService.ensureMarket({
          name: record.market,
          county: record.county ?? 'Unknown',
        });
        await this.marketsService.upsertPriceSnapshot({
          commodity: record.commodity,
          marketId: market.id,
          unit: record.unit,
          date: record.weekOf,
          medianPrice: record.medianPrice,
        });
      }
      this.logger.log(
        `Ingested ${grouped.length} KAMIS weekly prices.`,
      );
    } catch (error) {
      this.logger.error('KAMIS ingestion failed', error);
      await this.prisma.integrationLog.create({
        data: {
          source: 'KAMIS',
          level: 'error',
          message: error.message,
        },
      });
    }
  }

  private async fetchPriceData(date: Date): Promise<KamisRecord[]> {
    const baseUrl = this.configService.get<string>('integrations.kamisBaseUrl');
    if (!baseUrl) {
      this.logger.warn('KAMIS base URL not configured. Using sample data.');
      return this.sampleRecords(date);
    }
    const apiKey = this.configService.get<string>('integrations.kamisApiKey');
    const targetDate = dayjs(date).format('YYYY-MM-DD');
    try {
      const { data } = await this.http.axiosRef.get(baseUrl, {
        params: { date: targetDate },
        headers: apiKey
          ? {
              Authorization: `Bearer ${apiKey}`,
            }
          : undefined,
      });
      if (!Array.isArray(data)) {
        this.logger.warn('Unexpected KAMIS response format');
        return this.sampleRecords(date);
      }
      return data.map(
        (item: any): KamisRecord => ({
          commodity: item.commodity ?? item.crop ?? 'Maize',
          market: item.market ?? item.market_name ?? 'Nairobi',
          unit: item.unit ?? 'kg',
          price: Number(item.price ?? item.median_price ?? 0),
          date: item.date ?? targetDate,
        }),
      );
    } catch (error) {
      this.logger.warn(`KAMIS fetch failed; using fallback. ${error}`);
      return this.sampleRecords(date);
    }
  }

  private computeWeeklyMedian(
    records: KamisRecord[],
  ): Array<{
    commodity: string;
    market: string;
    county?: string;
    unit: string;
    medianPrice: number;
    weekOf: Date;
  }> {
    const grouped = new Map<string, KamisRecord[]>();
    for (const record of records) {
      const key = `${record.commodity.toLowerCase()}::${record.market.toLowerCase()}`;
      grouped.set(key, [...(grouped.get(key) ?? []), record]);
    }

    const results: Array<{
      commodity: string;
      market: string;
      county?: string;
      unit: string;
      medianPrice: number;
      weekOf: Date;
    }> = [];
    grouped.forEach((items, key) => {
      const sorted = items
        .map((item) => item.price)
        .filter((price) => price > 0)
        .sort((a, b) => a - b);
      if (sorted.length === 0) {
        return;
      }
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];

      const sample = items[0];
      const monday = dayjs(sample.date).startOf('week').toDate();
      results.push({
        commodity: sample.commodity,
        market: sample.market,
        unit: sample.unit,
        medianPrice: Math.round(median * 100) / 100,
        county: sample.market.includes('Nairobi') ? 'Nairobi' : undefined,
        weekOf: monday,
      });
    });
    return results;
  }

  private sampleRecords(date: Date): KamisRecord[] {
    const day = dayjs(date).format('YYYY-MM-DD');
    return [
      {
        commodity: 'Maize',
        market: 'Nairobi',
        unit: '90kg bag',
        price: 5600,
        date: day,
      },
      {
        commodity: 'Beans',
        market: 'Eldoret',
        unit: '90kg bag',
        price: 7200,
        date: day,
      },
      {
        commodity: 'Tea',
        market: 'Kericho',
        unit: 'kg',
        price: 320,
        date: day,
      },
    ];
  }
}
