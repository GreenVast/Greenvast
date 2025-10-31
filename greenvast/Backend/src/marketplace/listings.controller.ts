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
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingFilterDto } from './dto/listing-filter.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';

@ApiTags('Marketplace')
@Controller({ path: 'listings', version: '1' })
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  listListings(
    @Query() filters: ListingFilterDto,
    @CurrentUser() user?: RequestUser,
  ) {
    return this.listingsService.listListings(filters, user?.userId);
  }

  @Get(':id')
  getListing(@Param('id') id: string) {
    return this.listingsService.getListing(id);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  createListing(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateListingDto,
  ) {
    return this.listingsService.createListing(user.userId!, dto);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  updateListing(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.updateListing(user.userId!, id, dto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  archiveListing(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
  ) {
    return this.listingsService.archiveListing(user.userId!, id);
  }
}
