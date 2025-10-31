import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateListingDto {
  @IsOptional()
  @IsString()
  farmId?: string;

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
  @IsBoolean()
  openToOffers?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  media?: string[];

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsOptional()
  @IsDateString()
  availableTo?: string;
}
