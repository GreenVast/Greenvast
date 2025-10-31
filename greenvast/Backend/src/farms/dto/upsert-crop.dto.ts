import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertCropDto {
  @IsString()
  crop: string;

  @IsOptional()
  @IsString()
  variety?: string;

  @IsOptional()
  @IsDateString()
  plantingDate?: string;

  @IsOptional()
  @IsNumber()
  expectedYield?: number;

  @IsOptional()
  @IsString()
  yieldUnit?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
