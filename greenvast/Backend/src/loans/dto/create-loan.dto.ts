import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  principal: number;

  @IsString()
  lender: string;

  @IsOptional()
  @IsNumber()
  interestRate?: number;

  @IsDateString()
  startDate: string;

  @IsNumber()
  @Min(1)
  termMonths: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
