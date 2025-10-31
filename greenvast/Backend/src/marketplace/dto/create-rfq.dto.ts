import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRfqDto {
  @IsString()
  crop: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  farmId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  county?: string;
}
