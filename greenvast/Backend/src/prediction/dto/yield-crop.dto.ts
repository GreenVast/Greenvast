import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class YieldHistoryDto {
  @IsOptional()
  @IsString()
  season?: string;

  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  areaHa?: number;
}

export class YieldCropDto {
  @IsString()
  crop!: string;

  @IsNumber()
  areaHa!: number;

  @IsString()
  county!: string;

  @IsOptional()
  @IsString()
  subCounty?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => YieldHistoryDto)
  @IsArray()
  history?: YieldHistoryDto[];

  @IsOptional()
  @IsNumber()
  rainfall?: number;

  @IsOptional()
  @IsNumber()
  outbreakRisk?: number;
}
