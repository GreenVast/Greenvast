import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { UpsertCropDto } from './dto/upsert-crop.dto';
import { RecordInventoryDto } from './dto/record-inventory.dto';
import { UpsertLivestockDto } from './dto/upsert-livestock.dto';

@Injectable()
export class FarmsService {
  constructor(private readonly prisma: PrismaService) {}

  listFarms(userId: string) {
    return this.prisma.farm.findMany({
      where: { userId },
      include: {
        parcels: true,
        crops: true,
        livestock: true,
        inventoryLots: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createFarm(userId: string, dto: CreateFarmDto) {
    return this.prisma.farm.create({
      data: {
        userId,
        name: dto.name,
        county: dto.county,
        subCounty: dto.subCounty,
        sizeAcres: dto.sizeAcres,
        notes: dto.notes,
      },
    });
  }

  async updateFarm(userId: string, farmId: string, dto: UpdateFarmDto) {
    await this.ensureFarmOwnership(userId, farmId);
    return this.prisma.farm.update({
      where: { id: farmId },
      data: dto,
    });
  }

  async createParcel(userId: string, farmId: string, dto: CreateParcelDto) {
    await this.ensureFarmOwnership(userId, farmId);
    return this.prisma.parcel.create({
      data: {
        farmId,
        ...dto,
      },
    });
  }

  async updateParcel(
    userId: string,
    farmId: string,
    parcelId: string,
    dto: UpdateParcelDto,
  ) {
    await this.ensureFarmOwnership(userId, farmId);
    await this.ensureParcel(parcelId);
    return this.prisma.parcel.update({
      where: { id: parcelId },
      data: dto,
    });
  }

  async removeParcel(userId: string, farmId: string, parcelId: string) {
    await this.ensureFarmOwnership(userId, farmId);
    await this.ensureParcel(parcelId);
    await this.prisma.parcel.delete({
      where: { id: parcelId },
    });
  }

  async upsertCrop(
    userId: string,
    farmId: string,
    dto: UpsertCropDto,
    cropId?: string,
    parcelId?: string,
  ) {
    await this.ensureFarmOwnership(userId, farmId);
    if (cropId) {
      await this.ensureCrop(cropId);
      return this.prisma.cropPlan.update({
        where: { id: cropId },
        data: {
          ...dto,
          parcelId,
          plantingDate: dto.plantingDate ? new Date(dto.plantingDate) : undefined,
        },
      });
    }
    return this.prisma.cropPlan.create({
      data: {
        farmId,
        parcelId,
        crop: dto.crop,
        variety: dto.variety,
        plantingDate: dto.plantingDate ? new Date(dto.plantingDate) : undefined,
        expectedYield: dto.expectedYield,
        yieldUnit: dto.yieldUnit,
        status: dto.status,
        notes: dto.notes,
      },
    });
  }

  async removeCrop(userId: string, farmId: string, cropId: string) {
    await this.ensureFarmOwnership(userId, farmId);
    await this.ensureCrop(cropId);
    await this.prisma.cropPlan.delete({ where: { id: cropId } });
  }

  async recordInventory(
    userId: string,
    farmId: string,
    dto: RecordInventoryDto,
    inventoryId?: string,
  ) {
    await this.ensureFarmOwnership(userId, farmId);
    if (inventoryId) {
      await this.ensureInventory(inventoryId);
      return this.prisma.inventoryLot.update({
        where: { id: inventoryId },
        data: {
          ...dto,
          harvestDate: dto.harvestDate ? new Date(dto.harvestDate) : undefined,
        },
      });
    }
    return this.prisma.inventoryLot.create({
      data: {
        farmId,
        crop: dto.crop,
        grade: dto.grade,
        quantity: dto.quantity,
        unit: dto.unit ?? 'kg',
        pricePerUnit: dto.pricePerUnit,
        harvestDate: dto.harvestDate ? new Date(dto.harvestDate) : undefined,
        storageAt: dto.storageAt,
        notes: dto.notes,
      },
    });
  }

  async removeInventory(userId: string, farmId: string, inventoryId: string) {
    await this.ensureFarmOwnership(userId, farmId);
    await this.ensureInventory(inventoryId);
    await this.prisma.inventoryLot.delete({ where: { id: inventoryId } });
  }

  async upsertLivestock(
    userId: string,
    farmId: string,
    dto: UpsertLivestockDto,
    livestockId?: string,
  ) {
    await this.ensureFarmOwnership(userId, farmId);
    if (livestockId) {
      await this.ensureLivestock(livestockId);
      return this.prisma.livestock.update({
        where: { id: livestockId },
        data: dto,
      });
    }
    return this.prisma.livestock.create({
      data: {
        farmId,
        ...dto,
      },
    });
  }

  async removeLivestock(userId: string, farmId: string, livestockId: string) {
    await this.ensureFarmOwnership(userId, farmId);
    await this.ensureLivestock(livestockId);
    await this.prisma.livestock.delete({ where: { id: livestockId } });
  }

  private async ensureFarmOwnership(userId: string, farmId: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id: farmId },
      select: { userId: true },
    });
    if (!farm) {
      throw new NotFoundException('Farm not found');
    }
    if (farm.userId !== userId) {
      throw new ForbiddenException('Not allowed to modify this farm');
    }
  }

  private async ensureParcel(parcelId: string) {
    const parcel = await this.prisma.parcel.findUnique({
      where: { id: parcelId },
      select: { id: true },
    });
    if (!parcel) {
      throw new NotFoundException('Parcel not found');
    }
  }

  private async ensureCrop(cropId: string) {
    const crop = await this.prisma.cropPlan.findUnique({
      where: { id: cropId },
      select: { id: true },
    });
    if (!crop) {
      throw new NotFoundException('Crop not found');
    }
  }

  private async ensureInventory(inventoryId: string) {
    const inventory = await this.prisma.inventoryLot.findUnique({
      where: { id: inventoryId },
      select: { id: true },
    });
    if (!inventory) {
      throw new NotFoundException('Inventory lot not found');
    }
  }

  private async ensureLivestock(livestockId: string) {
    const livestock = await this.prisma.livestock.findUnique({
      where: { id: livestockId },
      select: { id: true },
    });
    if (!livestock) {
      throw new NotFoundException('Livestock record not found');
    }
  }
}
