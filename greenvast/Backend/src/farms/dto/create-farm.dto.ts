import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFarmDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  county?: string;

  @IsOptional()
  @IsString()
  subCounty?: string;

  @IsOptional()
  @IsNumber()
  sizeAcres?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
