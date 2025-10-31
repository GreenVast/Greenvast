import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService implements OnModuleDestroy {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private app?: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  private initialize() {
    if (this.app) {
      return;
    }

    const projectId = this.configService.get<string>('firebase.projectId');
    const clientEmail = this.configService.get<string>('firebase.clientEmail');
    const privateKey = this.configService.get<string>('firebase.privateKey');

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn('Firebase credentials are not fully configured.');
      return;
    }

    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    this.logger.log('Firebase Admin SDK initialized.');
  }

  getAuth(): admin.auth.Auth | undefined {
    this.initialize();
    return this.app?.auth();
  }

  async onModuleDestroy() {
    if (this.app) {
      await this.app.delete();
    }
  }
}
