import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdvisoryService, type AdvisoryResponse } from './advisory.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('Advisory')
@ApiBearerAuth('firebase')
@UseGuards(FirebaseAuthGuard)
@Controller({ path: 'advisory', version: '1' })
export class AdvisoryController {
  constructor(private readonly advisoryService: AdvisoryService) {}

  @Get()
  async getFarmAdvisory(
    @Query('farmId') farmId: string,
  ): Promise<AdvisoryResponse> {
    return this.advisoryService.getAdvisory(farmId);
  }
}
