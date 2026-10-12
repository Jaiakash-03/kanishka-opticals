import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export type UploadTarget = 'public' | 'private';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly publicBucket: string;
  private readonly privateBucket: string;
  private readonly cdnUrl: string;

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3Client({ region: config.get('aws.region', 'ap-south-1'), credentials: { accessKeyId: config.get('aws.accessKeyId')!, secretAccessKey: config.get('aws.secretAccessKey')! } });
    this.publicBucket = config.get('aws.s3Bucket')!;
    this.privateBucket = config.get('aws.s3BucketPrivate')!;
    this.cdnUrl = config.get('aws.cdnUrl', '');
  }

  async uploadProductImage(buffer: Buffer, _originalName: string): Promise<{ thumbnail: string; medium: string; large: string }> {
    const id = uuidv4();
    const sizes = [{ suffix: 'thumb', w: 200, h: 200 }, { suffix: 'medium', w: 600, h: 600 }, { suffix: 'large', w: 1200, h: 1200 }];
    const urls: Record<string, string> = {};
    for (const size of sizes) {
      const webp = await sharp(buffer).resize(size.w, size.h, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
      const key = `products/${id}-${size.suffix}.webp`;
      await this.s3.send(new PutObjectCommand({ Bucket: this.publicBucket, Key: key, Body: webp, ContentType: 'image/webp', CacheControl: 'public, max-age=31536000' }));
      urls[size.suffix] = this.cdnUrl ? `${this.cdnUrl}/${key}` : `https://${this.publicBucket}.s3.amazonaws.com/${key}`;
    }
    return { thumbnail: urls['thumb']!, medium: urls['medium']!, large: urls['large']! };
  }

  async uploadPrescription(buffer: Buffer, userId: string, originalName: string): Promise<string> {
    const ext = originalName.split('.').pop() ?? 'pdf';
    const key = `prescriptions/${userId}/${uuidv4()}.${ext}`;
    await this.s3.send(new PutObjectCommand({ Bucket: this.privateBucket, Key: key, Body: buffer, ContentType: ext === 'pdf' ? 'application/pdf' : 'image/jpeg' }));
    return key;
  }

  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    return getSignedUrl(this.s3, new GetObjectCommand({ Bucket: this.privateBucket, Key: key }), { expiresIn });
  }

  async deleteFile(key: string, target: UploadTarget = 'public'): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({ Bucket: target === 'public' ? this.publicBucket : this.privateBucket, Key: key }));
  }
}
