import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer-status.dto';

@ApiTags('Offers')
@ApiBearerAuth('firebase')
@UseGuards(FirebaseAuthGuard)
@Controller({ path: 'offers', version: '1' })
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  listOffers(@Query('listingId') listingId: string) {
    return this.offersService.listOffersForListing(listingId);
  }

  @Post()
  createOffer(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateOfferDto,
  ) {
    return this.offersService.createOffer(user.userId!, dto);
  }

  @Patch(':offerId/status')
  updateStatus(
    @CurrentUser() user: RequestUser,
    @Param('offerId') offerId: string,
    @Body() dto: UpdateOfferStatusDto,
  ) {
    return this.offersService.updateOfferStatus(user.userId!, offerId, dto);
  }

  @Delete(':offerId')
  cancelOffer(
    @CurrentUser() user: RequestUser,
    @Param('offerId') offerId: string,
  ) {
    return this.offersService.cancelOffer(user.userId!, offerId);
  }
}
