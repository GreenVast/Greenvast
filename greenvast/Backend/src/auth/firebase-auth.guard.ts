import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    private readonly firebaseAdmin: FirebaseAdminService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || '';
    const [, token] = authHeader.split('Bearer ');

    if (!token) {
      throw new UnauthorizedException('Missing Firebase token');
    }

    const auth = this.firebaseAdmin.getAuth();
    if (!auth) {
      this.logger.warn(
        'Firebase Admin SDK is not configured; allowing request for development only.',
      );
      request.user = {
        uid: 'dev-user',
        role: 'ADMIN',
      } satisfies RequestUser;
      return true;
    }

    try {
      const decoded = await auth.verifyIdToken(token);

      const user = await this.prisma.user.findUnique({
        where: { firebaseUid: decoded.uid },
        include: { profile: true, consents: true },
      });

      request.user = {
        uid: decoded.uid,
        userId: user?.id,
        role: user?.role,
        email: decoded.email,
        phoneNumber: decoded.phone_number,
        claims: decoded,
      } satisfies RequestUser;

      return true;
    } catch (error) {
      this.logger.error('Firebase authentication failed', error);
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
