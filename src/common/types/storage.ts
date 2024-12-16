import { PutObjectAclCommandOutput } from "@aws-sdk/client-s3";

export interface FileData {
    filename: string;
    fileData: ArrayBuffer;
}
export interface FileStorage {
    upload(data: FileData): Promise<PutObjectAclCommandOutput>;
    delete(filename: string): Promise<PutObjectAclCommandOutput>;
    getObjectUri(filename: string): string;
}
