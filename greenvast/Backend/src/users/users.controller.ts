import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  async syncUser(
    @CurrentUser() user: RequestUser,
    @Body() dto: RegisterUserDto,
  ) {
    return this.usersService.register({
      firebaseUid: user.uid ?? dto.firebaseUid,
      role: dto.role,
      name: dto.name,
      phoneNumber: dto.phoneNumber ?? user.phoneNumber,
    });
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  async getMe(@CurrentUser() user: RequestUser) {
    if (!user?.uid) {
      return null;
    }
    return this.usersService.getByFirebaseUid(user.uid);
  }

  @Patch('me/profile')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  async updateProfile(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId!, dto);
  }

  @Patch('me/consent')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  async updateConsent(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateConsentDto,
  ) {
    return this.usersService.upsertConsent(user.userId!, dto);
  }

  @Get('me/export')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  async exportData(@CurrentUser() user: RequestUser) {
    return this.usersService.exportUserData(user.userId!);
  }

  @Delete('me')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMe(@CurrentUser() user: RequestUser) {
    await this.usersService.deleteUser(user.userId!);
  }
}
