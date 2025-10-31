import {
  BadGatewayException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { PriceDto } from './dto/price.dto';
import { YieldCropDto } from './dto/yield-crop.dto';
import { YieldLivestockDto } from './dto/yield-livestock.dto';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);
  private readonly pythonBaseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.pythonBaseUrl =
      this.config.get<string>('integrations.pythonServiceUrl') ??
      this.config.get<string>('ai.pythonServiceUrl') ??
      'http://localhost:8000';
  }

  private buildUrl(path: string): string {
    return `${this.pythonBaseUrl.replace(/\/$/, '')}${path}`;
  }

  private async postToPython<T extends Record<string, unknown>>(
    path: string,
    payload: unknown,
  ): Promise<T> {
    try {
      const url = this.buildUrl(path);
      const response = await firstValueFrom(this.http.post<T>(url, payload));
      return response.data;
    } catch (error) {
      this.logger.error(
        `Python AI service request failed (${path})`,
        (error as Error).message,
      );
      throw new BadGatewayException('Prediction service unavailable');
    }
  }

  async predictPrice(dto: PriceDto): Promise<Record<string, unknown>> {
    return this.postToPython('/predict/price', dto);
  }

  async predictYieldCrop(dto: YieldCropDto): Promise<Record<string, unknown>> {
    return this.postToPython('/predict/yield/crop', dto);
  }

  async predictYieldLivestock(
    dto: YieldLivestockDto,
  ): Promise<Record<string, unknown>> {
    return this.postToPython('/predict/yield/livestock', dto);
  }

  async trainPrices(rows: unknown[]): Promise<Record<string, unknown>> {
    return this.postToPython('/train/price', { rows });
  }
}
