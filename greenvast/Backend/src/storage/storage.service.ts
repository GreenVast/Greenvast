import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client?: S3Client;

  constructor(private readonly configService: ConfigService) {
    const accessKey = this.configService.get<string>('storage.accessKey');
    const secretKey = this.configService.get<string>('storage.secretKey');
    const region = this.configService.get<string>('storage.region');
    const endpoint = this.configService.get<string>('storage.endpoint');

    if (accessKey && secretKey) {
      this.s3Client = new S3Client({
        region,
        endpoint: endpoint || undefined,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
        forcePathStyle: Boolean(endpoint),
      });
    } else {
      this.logger.warn('S3 credentials not configured. Storage disabled.');
    }
  }

  async createSignedUploadUrl(params: {
    userId: string;
    fileName: string;
    contentType: string;
  }) {
    if (!this.s3Client) {
      return {
        uploadUrl: null,
        assetUrl: null,
        message: 'Storage not configured',
      };
    }

    const bucket = this.configService.get<string>('storage.bucket');
    if (!bucket) {
      throw new Error('Storage bucket not configured');
    }

    const extension = params.fileName.split('.').pop();
    const key = `uploads/${params.userId}/${randomUUID()}.${
      extension ?? 'dat'
    }`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: params.contentType,
      ACL: 'public-read',
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 600,
    });

    const endpoint = this.configService.get<string>('storage.endpoint');
    const assetUrl = endpoint
      ? `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`
      : `https://${bucket}.s3.${this.configService.get<string>(
          'storage.region',
          'us-east-1',
        )}.amazonaws.com/${key}`;

    return {
      uploadUrl,
      assetUrl,
      expiresIn: 600,
    };
  }
}
