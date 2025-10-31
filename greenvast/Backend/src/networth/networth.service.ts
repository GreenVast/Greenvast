import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketsService } from '../markets/markets.service';
import { Decimal } from '@prisma/client/runtime/library';

const LAND_VALUE_PER_ACRE = 250000; // KSh conservative estimate

@Injectable()
export class NetworthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly marketsService: MarketsService,
  ) {}

  async calculate(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        farms: {
          include: {
            inventoryLots: true,
            crops: true,
          },
        },
        loans: { include: { repayments: true } },
        consents: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uniqueCrops = new Set<string>();
    user.farms.forEach((farm) => {
      farm.inventoryLots.forEach((lot) => uniqueCrops.add(lot.crop));
      farm.crops.forEach((crop) => uniqueCrops.add(crop.crop));
    });

    const priceCache = new Map<string, number>();
    for (const crop of uniqueCrops) {
      const weekly = await this.marketsService.getWeeklyPrice(crop);
      if (weekly.weeklyPrice) {
        priceCache.set(crop.toLowerCase(), weekly.weeklyPrice);
      }
    }

    const landComponent = user.farms.reduce((sum, farm) => {
      const acres = farm.sizeAcres ? Number(farm.sizeAcres) : 0;
      return sum + acres * LAND_VALUE_PER_ACRE;
    }, 0);

    const inventoryComponent = user.farms.reduce((sum, farm) => {
      return (
        sum +
        farm.inventoryLots.reduce((acc, lot) => {
          const price =
            lot.pricePerUnit != null
              ? Number(lot.pricePerUnit)
              : priceCache.get(lot.crop.toLowerCase()) ?? 0;
          return acc + Number(lot.quantity) * price;
        }, 0)
      );
    }, 0);

    const expectedYieldComponent = user.farms.reduce((sum, farm) => {
      return (
        sum +
        farm.crops.reduce((acc, crop) => {
          const expected = crop.expectedYield
            ? Number(crop.expectedYield)
            : 0;
          const price =
            priceCache.get(crop.crop.toLowerCase()) ??
            priceCache.get('maize') ??
            0;
          const conservativePrice = price * 0.85;
          return acc + expected * conservativePrice;
        }, 0)
      );
    }, 0);

    const outstandingLoans = user.loans.reduce((sum, loan) => {
      const principal = Number(loan.principal);
      const rate = loan.interestRate ? Number(loan.interestRate) : 0;
      const expected = principal + principal * (rate / 100);
      const paid = loan.repayments.reduce(
        (acc, repayment) => acc + Number(repayment.amount),
        0,
      );
      return sum + Math.max(expected - paid, 0);
    }, 0);

    const components = {
      land: Math.round(landComponent),
      inventory: Math.round(inventoryComponent),
      expectedYield: Math.round(expectedYieldComponent),
      loans: Math.round(outstandingLoans),
    };

    const net =
      components.land +
      components.inventory +
      components.expectedYield -
      components.loans;
    const low = Math.round(net * 0.9);
    const high = Math.round(net * 1.15);

    const record = await this.prisma.netWorthRecord.create({
      data: {
        userId,
        low: new Decimal(low),
        mid: new Decimal(net),
        high: new Decimal(high),
        components,
      },
    });

    return {
      low,
      mid: net,
      high,
      updatedAt: record.computedAt,
      components,
      consented: user.consents?.dataSharing ?? false,
    };
  }
}
