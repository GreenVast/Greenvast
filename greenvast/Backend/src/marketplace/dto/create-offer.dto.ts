import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  listingId: string;

  @IsOptional()
  @IsNumber()
  pricePerUnit?: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  message?: string;
}
