import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RfqService } from './rfq.service';
import { RfqFilterDto } from './dto/rfq-filter.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { RespondRfqDto } from './dto/respond-rfq.dto';

@ApiTags('RFQ')
@Controller({ path: 'rfq', version: '1' })
export class RfqController {
  constructor(private readonly rfqService: RfqService) {}

  @Get()
  listRfqs(@Query() filters: RfqFilterDto) {
    return this.rfqService.listRfqs(filters);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  createRfq(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateRfqDto,
  ) {
    return this.rfqService.createRfq(user.userId!, dto);
  }

  @Post(':rfqId/respond')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  respond(
    @CurrentUser() user: RequestUser,
    @Param('rfqId') rfqId: string,
    @Body() dto: RespondRfqDto,
  ) {
    return this.rfqService.respondToRfq(user.userId!, rfqId, dto);
  }
}
