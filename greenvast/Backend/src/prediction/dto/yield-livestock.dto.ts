import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class YieldLivestockDto {
  @IsEnum(['Dairy', 'Beef'])
  type!: 'Dairy' | 'Beef';

  @IsNumber()
  headCount!: number;

  @IsOptional()
  @IsNumber()
  sessionsPerDay?: number;

  @IsOptional()
  @IsNumber()
  avgMilkLpd?: number;

  @IsOptional()
  @IsNumber()
  droughtRisk?: number;

  @IsOptional()
  @IsNumber()
  outbreakRisk?: number;

  @IsOptional()
  @IsArray()
  history?: Record<string, unknown>[];
}
