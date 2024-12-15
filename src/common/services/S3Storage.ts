import {
    PutObjectCommand,
    PutObjectCommandInput,
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
    upload = async (data: FileData): Promise<void> => {
        const objectParams = {
            Bucket: config.get('s3.bucket'),
            Key: data.filename,
            Body: data.fileData,
        };
        await this.client.send(
            new PutObjectCommand(objectParams as PutObjectCommandInput),
        );
    };

    delete(filename: string): void {
        // Delete file from S3
        
    }

    getObjectUri(filename: string): string {
        // Get object URI from S3
        return `https://s3.amazonaws.com/${filename}`;
    }
}
