import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateParcelDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsNumber()
  areaAcres?: number;

  @IsOptional()
  @IsString()
  cropType?: string;

  @IsOptional()
  @IsString()
  soilType?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;
}
