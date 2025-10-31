import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FarmsService } from './farms.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { UpsertCropDto } from './dto/upsert-crop.dto';
import { RecordInventoryDto } from './dto/record-inventory.dto';
import { UpsertLivestockDto } from './dto/upsert-livestock.dto';

@ApiTags('Farms')
@ApiBearerAuth('firebase')
@UseGuards(FirebaseAuthGuard)
@Controller({ path: 'farms', version: '1' })
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Get()
  getFarms(@CurrentUser() user: RequestUser) {
    return this.farmsService.listFarms(user.userId!);
  }

  @Post()
  createFarm(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateFarmDto,
  ) {
    return this.farmsService.createFarm(user.userId!, dto);
  }

  @Patch(':farmId')
  updateFarm(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Body() dto: UpdateFarmDto,
  ) {
    return this.farmsService.updateFarm(user.userId!, farmId, dto);
  }

  @Post(':farmId/parcels')
  createParcel(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Body() dto: CreateParcelDto,
  ) {
    return this.farmsService.createParcel(user.userId!, farmId, dto);
  }

  @Patch(':farmId/parcels/:parcelId')
  updateParcel(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Param('parcelId') parcelId: string,
    @Body() dto: UpdateParcelDto,
  ) {
    return this.farmsService.updateParcel(
      user.userId!,
      farmId,
      parcelId,
      dto,
    );
  }

  @Delete(':farmId/parcels/:parcelId')
  removeParcel(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Param('parcelId') parcelId: string,
  ) {
    return this.farmsService.removeParcel(user.userId!, farmId, parcelId);
  }

  @Post(':farmId/crops')
  createCrop(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Body() dto: UpsertCropDto,
  ) {
    return this.farmsService.upsertCrop(user.userId!, farmId, dto);
  }

  @Patch(':farmId/crops/:cropId')
  updateCrop(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Param('cropId') cropId: string,
    @Body() dto: UpsertCropDto,
  ) {
    return this.farmsService.upsertCrop(
      user.userId!,
      farmId,
      dto,
      cropId,
    );
  }

  @Delete(':farmId/crops/:cropId')
  removeCrop(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Param('cropId') cropId: string,
  ) {
    return this.farmsService.removeCrop(user.userId!, farmId, cropId);
  }

  @Post(':farmId/inventory')
  recordInventory(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Body() dto: RecordInventoryDto,
  ) {
    return this.farmsService.recordInventory(
      user.userId!,
      farmId,
      dto,
    );
  }

  @Patch(':farmId/inventory/:inventoryId')
  updateInventory(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Param('inventoryId') inventoryId: string,
    @Body() dto: RecordInventoryDto,
  ) {
    return this.farmsService.recordInventory(
      user.userId!,
      farmId,
      dto,
      inventoryId,
    );
  }

  @Delete(':farmId/inventory/:inventoryId')
  removeInventory(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Param('inventoryId') inventoryId: string,
  ) {
    return this.farmsService.removeInventory(
      user.userId!,
      farmId,
      inventoryId,
    );
  }

  @Post(':farmId/livestock')
  addLivestock(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Body() dto: UpsertLivestockDto,
  ) {
    return this.farmsService.upsertLivestock(
      user.userId!,
      farmId,
      dto,
    );
  }

  @Patch(':farmId/livestock/:livestockId')
  updateLivestock(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Param('livestockId') livestockId: string,
    @Body() dto: UpsertLivestockDto,
  ) {
    return this.farmsService.upsertLivestock(
      user.userId!,
      farmId,
      dto,
      livestockId,
    );
  }

  @Delete(':farmId/livestock/:livestockId')
  removeLivestock(
    @CurrentUser() user: RequestUser,
    @Param('farmId') farmId: string,
    @Param('livestockId') livestockId: string,
  ) {
    return this.farmsService.removeLivestock(
      user.userId!,
      farmId,
      livestockId,
    );
  }
}
