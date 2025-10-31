import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { CommunitiesModule } from '../communities/communities.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CommunitiesModule, PrismaModule, AuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
