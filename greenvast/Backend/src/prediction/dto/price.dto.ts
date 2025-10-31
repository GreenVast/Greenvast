import { IsOptional, IsString } from 'class-validator';

export class PriceDto {
  @IsString()
  commodity!: string;

  @IsString()
  market!: string;

  @IsOptional()
  @IsString()
  date?: string;
}
