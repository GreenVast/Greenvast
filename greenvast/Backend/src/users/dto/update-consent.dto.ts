import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateConsentDto {
  @IsOptional()
  @IsBoolean()
  dataSharing?: boolean;

  @IsOptional()
  @IsBoolean()
  analytics?: boolean;
}
