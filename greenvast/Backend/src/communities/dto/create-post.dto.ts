import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(500)
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  media?: string[];
}
