import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import configuration from './config/configuration';
import { validate } from './config/validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FarmsModule } from './farms/farms.module';
import { MarketsModule } from './markets/markets.module';
import { AdvisoryModule } from './advisory/advisory.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { CommunitiesModule } from './communities/communities.module';
import { LoansModule } from './loans/loans.module';
import { NetworthModule } from './networth/networth.module';
import { StorageModule } from './storage/storage.module';
import { AdminModule } from './admin/admin.module';
import { I18nModule } from './i18n/i18n.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { PredictionModule } from './prediction/prediction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: 60 * 5,
        max: 100,
        isGlobal: true,
        store: 'memory',
      }),
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
          password: config.get<string>('redis.password') || undefined,
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    FarmsModule,
    MarketsModule,
    AdvisoryModule,
    MarketplaceModule,
    CommunitiesModule,
    LoansModule,
    NetworthModule,
    StorageModule,
    AdminModule,
    I18nModule,
    IntegrationsModule,
    PredictionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
