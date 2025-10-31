import { IsString, MaxLength } from 'class-validator';

export class ReportPostDto {
  @IsString()
  @MaxLength(240)
  reason: string;
}
