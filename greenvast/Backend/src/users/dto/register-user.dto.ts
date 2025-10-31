import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterUserDto {
  @IsString()
  firebaseUid: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber('KE')
  phoneNumber?: string;
}
