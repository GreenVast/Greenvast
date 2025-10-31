import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PredictionService } from './prediction.service';
import { PriceDto } from './dto/price.dto';
import { YieldCropDto } from './dto/yield-crop.dto';
import { YieldLivestockDto } from './dto/yield-livestock.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';

@ApiTags('Prediction')
@ApiBearerAuth('firebase')
@UseGuards(FirebaseAuthGuard)
@Controller({ path: 'prediction', version: '1' })
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post('price')
  async price(@Body() dto: PriceDto) {
    const data = await this.predictionService.predictPrice(dto);
    return { service: 'python-ai', ...data };
  }

  @Post('yield/crop')
  async crop(@Body() dto: YieldCropDto) {
    const data = await this.predictionService.predictYieldCrop(dto);
    return { service: 'python-ai', ...data };
  }

  @Post('yield/livestock')
  async livestock(@Body() dto: YieldLivestockDto) {
    const data = await this.predictionService.predictYieldLivestock(dto);
    return { service: 'python-ai', ...data };
  }

  @Post('train/price')
  async train(
    @Body('rows') rows: unknown[],
    @CurrentUser() user: RequestUser,
  ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admins only');
    }
    const data = await this.predictionService.trainPrices(rows ?? []);
    return { service: 'python-ai', ...data };
  }
}
