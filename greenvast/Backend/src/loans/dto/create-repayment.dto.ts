import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRepaymentDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  paidAt: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
