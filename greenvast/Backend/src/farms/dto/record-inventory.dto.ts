import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RecordInventoryDto {
  @IsString()
  crop: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  pricePerUnit?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsDateString()
  harvestDate?: string;

  @IsOptional()
  @IsString()
  storageAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
