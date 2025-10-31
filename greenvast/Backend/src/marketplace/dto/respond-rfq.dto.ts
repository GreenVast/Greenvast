import { IsOptional, IsString } from 'class-validator';

export class RespondRfqDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  listingId?: string;
}
