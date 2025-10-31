import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { IsMimeType, IsString } from 'class-validator';

class UploadRequestDto {
  @IsString()
  fileName: string;

  @IsString()
  @IsMimeType()
  contentType: string;
}

@ApiTags('Storage')
@ApiBearerAuth('firebase')
@UseGuards(FirebaseAuthGuard)
@Controller({ path: 'storage', version: '1' })
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  async createUploadUrl(
    @CurrentUser() user: RequestUser,
    @Body() dto: UploadRequestDto,
  ) {
    return this.storageService.createSignedUploadUrl({
      userId: user.userId!,
      fileName: dto.fileName,
      contentType: dto.contentType,
    });
  }
}
