import {
  Controller,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NetworthService } from './networth.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';

@ApiTags('NetWorth')
@ApiBearerAuth('firebase')
@UseGuards(FirebaseAuthGuard)
@Controller({ path: 'farmer', version: '1' })
export class NetworthController {
  constructor(private readonly networthService: NetworthService) {}

  @Get(':id/networth')
  async getNetworth(
    @CurrentUser() user: RequestUser,
    @Param('id') farmerId: string,
  ) {
    if (user.userId !== farmerId && user.role !== 'ADMIN') {
      throw new ForbiddenException('Net worth is private');
    }
    const report = await this.networthService.calculate(farmerId);
    if (user.userId !== farmerId && !report.consented) {
      throw new ForbiddenException('Farmer declined sharing');
    }
    const { consented, ...rest } = report;
    return rest;
  }
}
