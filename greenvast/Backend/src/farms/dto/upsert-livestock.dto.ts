import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpsertLivestockDto {
  @IsString()
  @MaxLength(120)
  type: string;

  @IsInt()
  @Min(0)
  count: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
