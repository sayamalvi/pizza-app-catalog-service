import {
    DeleteObjectCommand,
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { FileData, FileStorage } from '../types/storage';
import config from 'config';

export class S3Storage implements FileStorage {
    private client: S3Client;
    constructor() {
        this.client = new S3Client({
            region: config.get('s3.region'),
            credentials: {
                accessKeyId: config.get('s3.accessKeyId'),
                secretAccessKey: config.get('s3.secretAccessKey'),
            },
        });
    }
    upload = async (data: FileData): Promise<PutObjectCommandOutput> => {
        const objectParams = {
            Bucket: config.get('s3.bucket'),
            Key: data.filename,
            Body: data.fileData,
        };
        return await this.client.send(
            new PutObjectCommand(objectParams as PutObjectCommandInput),
        );
    };

    delete = async (filename: string): Promise<PutObjectCommandOutput> => {
        const objectParams = {
            Bucket: config.get('s3.bucket'),
            Key: filename,
        };
        return await this.client.send(
            new DeleteObjectCommand(objectParams as PutObjectCommandInput),
        );
    };

    getObjectUri(filename: string): string {
        const bucket = config.get('s3.bucket');
        const region = config.get('s3.region');
        if (typeof bucket == 'string' && typeof region == 'string') {
            return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
        }
        const error = new Error('Invalid s3 config');
        throw error;
    }
}
