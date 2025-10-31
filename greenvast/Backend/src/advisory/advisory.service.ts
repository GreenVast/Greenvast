import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AdvisoryAction } from '@prisma/client';

export interface AdvisoryResponse {
  action: AdvisoryAction;
  text_en: string;
  text_sw: string;
  icon: string;
  updatedAt: string;
}

@Injectable()
export class AdvisoryService {
  private readonly logger = new Logger(AdvisoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAdvisory(farmId: string): Promise<AdvisoryResponse> {
    const farm = await this.prisma.farm.findUnique({
      where: { id: farmId },
    });
    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    const recent = await this.prisma.advisory.findFirst({
      where: { farmId },
      orderBy: { date: 'desc' },
    });
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    if (recent && recent.updatedAt > twelveHoursAgo) {
      return {
        action: recent.action,
        text_en: recent.textEn,
        text_sw: recent.textSw,
        icon: recent.icon ?? 'info',
        updatedAt: recent.updatedAt.toISOString(),
      };
    }

    const forecast = await this.fetchForecast(farm.coordinates);
    const advisory = this.buildAdvisory(forecast);

    const saved = await this.prisma.advisory.upsert({
      where: {
        farmId_date: {
          farmId,
          date: new Date(new Date().toISOString().slice(0, 10)),
        },
      },
      update: {
        action: advisory.action,
        textEn: advisory.text_en,
        textSw: advisory.text_sw,
        icon: advisory.icon,
      },
      create: {
        farmId,
        date: new Date(),
        action: advisory.action,
        textEn: advisory.text_en,
        textSw: advisory.text_sw,
        icon: advisory.icon,
      },
    });

    await this.persistWeather(farmId, forecast);

    return {
      action: saved.action,
      text_en: saved.textEn,
      text_sw: saved.textSw,
      icon: saved.icon ?? 'info',
      updatedAt: saved.updatedAt.toISOString(),
    };
  }

  private async fetchForecast(coordinates: any) {
    const openWeatherKey = this.configService.get<string>(
      'integrations.openWeatherKey',
    );
    if (!openWeatherKey) {
      this.logger.warn('OpenWeather key missing. Returning mock forecast.');
      return this.buildMockForecast();
    }
    const lat =
      coordinates?.lat ??
      coordinates?.latitude ??
      this.configService.get<number>('weather.defaultLat', -1.286389);
    const lon =
      coordinates?.lng ??
      coordinates?.longitude ??
      this.configService.get<number>('weather.defaultLon', 36.817223);

    const { data } = await this.httpService.axiosRef.get(
      'https://api.openweathermap.org/data/3.0/onecall',
      {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: openWeatherKey,
          exclude: 'minutely,hourly,current,alerts',
        },
      },
    );
    return data?.daily ?? [];
  }

  private buildAdvisory(daily: any[]): AdvisoryResponse {
    if (!daily || daily.length === 0) {
      return {
        action: AdvisoryAction.WATCH,
        text_en: 'No forecast available. Check again later.',
        text_sw: 'Hakuna utabiri sasa. Jaribu tena baadaye.',
        icon: 'cloud-question',
        updatedAt: new Date().toISOString(),
      };
    }

    const forecast = daily.slice(0, 7).map((day: any) => ({
      pop: typeof day.pop === 'number' ? day.pop * 100 : 0,
      rain: typeof day.rain === 'number' ? day.rain : 0,
      tempMax: day.temp?.max ?? 0,
      tempMin: day.temp?.min ?? 0,
      date: new Date(day.dt * 1000),
    }));

    const next3 = forecast.slice(0, 3);
    const next2 = forecast.slice(0, 2);
    const dryWindow = forecast.find(
      (day, index) =>
        day.pop < 30 &&
        (forecast[index + 1]?.pop ?? 100) < 30 &&
        day.rain < 5,
    );
    const heavyRain = forecast.find((day) => day.rain > 10);

    const shouldPlant =
      next3.length === 3 &&
      next3.every((day) => day.pop >= 60 && day.tempMax <= 30);

    const harvestBlocked = next2.some((day) => day.pop >= 50);

    if (shouldPlant) {
      return {
        action: AdvisoryAction.PLANT,
        text_en: 'Good to plant next 3 days. Prepare seeds now.',
        text_sw: 'Ni vizuri kupanda siku 3 zijazo. Andaa mbegu sasa.',
        icon: 'seedling',
        updatedAt: new Date().toISOString(),
      };
    }

    if (heavyRain) {
      return {
        action: AdvisoryAction.WEED,
        text_en:
          'Heavy rain expected. Delay weeding until soil drains.',
        text_sw:
          'Mvua kubwa inatarajiwa. Subiri kupalilia hadi udongo ukauke.',
        icon: 'umbrella',
        updatedAt: new Date().toISOString(),
      };
    }

    if (!harvestBlocked && dryWindow) {
      const weekday = dryWindow.date.toLocaleDateString('en-KE', {
        weekday: 'long',
      });
      return {
        action: AdvisoryAction.HARVEST,
        text_en: `Best harvest window starts ${weekday}. Plan labour.`,
        text_sw: `Dirisha bora la kuvuna linaanza ${weekday}. Panga vibarua.`,
        icon: 'scythe',
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      action: AdvisoryAction.WATCH,
      text_en: 'Keep monitoring fields. No major weather alerts.',
      text_sw: 'Endelea kufuatilia shamba. Hakuna tahadhari kubwa.',
      icon: 'eye',
      updatedAt: new Date().toISOString(),
    };
  }

  private async persistWeather(farmId: string, daily: any[]) {
    if (!daily || !Array.isArray(daily)) {
      return;
    }
    const entries = daily.slice(0, 7).map((day: any) => ({
      date: new Date(day.dt * 1000),
      rain: typeof day.rain === 'number' ? day.rain : null,
      pop: typeof day.pop === 'number' ? Math.round(day.pop * 100) : null,
      tempMax: day.temp?.max ?? null,
      tempMin: day.temp?.min ?? null,
    }));

    for (const entry of entries) {
      await this.prisma.weatherDaily.upsert({
        where: {
          farmId_date: {
            farmId,
            date: entry.date,
          },
        },
        update: {
          rainMm: entry.rain,
          pop: entry.pop,
          tempMax: entry.tempMax,
          tempMin: entry.tempMin,
        },
        create: {
          farmId,
          date: entry.date,
          rainMm: entry.rain,
          pop: entry.pop,
          tempMax: entry.tempMax,
          tempMin: entry.tempMin,
        },
      });
    }
  }

  private buildMockForecast() {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, index) => ({
      dt: Math.floor(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + index,
        ).getTime() / 1000,
      ),
      pop: index < 3 ? 0.7 : 0.3,
      rain: index === 2 ? 12 : 3,
      temp: { max: 28, min: 18 },
    }));
  }
}
