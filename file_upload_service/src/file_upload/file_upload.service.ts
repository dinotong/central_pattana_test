import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { KafkaProducerService } from 'src/kafka/kafka.producer.service';

@Injectable()
export class FileUploadService {
  private minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly serviceUrl: string;
  constructor(
    private configService: ConfigService,
    private kafkaProducerService: KafkaProducerService,
  ) {
    const endPoint = this.configService.get('MINIO_ENDPOINT');
    const port = parseInt(this.configService.get('MINIO_PORT'));
    const accessKey = this.configService.get('MINIO_ACCESS_KEY');
    const secretKey = this.configService.get('MINIO_SECRET_KEY');
    const useSSL = false;
    const bucketName = this.configService.get('MINIO_BUCKET_NAME');
    this.serviceUrl = this.configService.get('SERVICE_URL');

    this.bucketName = bucketName;
    this.minioClient = new Minio.Client({
      endPoint: endPoint,
      port: port,
      accessKey: accessKey,
      secretKey: secretKey,
      useSSL: useSSL,
    });
  }

  async uploadFile(
    fileName: string,
    fileContent: Readable,
    emailNotification: string,
  ): Promise<string> {
    try {
      const file = await this.minioClientPutObject(fileName, fileContent);
      const data = {
        emailNotification: emailNotification,
        fileName: fileName,
        url: this.serviceUrl + 'file/',
      };
      const value = JSON.stringify(data);

      await this.kafkaProducerService.sendToTopic('emailNotification', value);

      return file.etag;
    } catch (error) {
      throw error;
    }
  }

  async minioClientPutObject(
    fileName: string,
    fileContent: Readable,
  ): Promise<Minio.UploadedObjectInfo> {
    return new Promise((resolve, reject) => {
      this.minioClient.putObject(
        this.bucketName,
        fileName,
        fileContent,
        (err, etag) => {
          if (err) {
            reject(err);
          } else {
            resolve(etag);
          }
        },
      );
    });
  }

  async getFileByName(fileName: string): Promise<Readable> {
    return await this.minioClientGetObject(fileName);
  }

  async minioClientGetObject(fileName: string): Promise<Readable> {
    return new Promise((resolve, reject) => {
      this.minioClient.getObject(this.bucketName, fileName, (err, stream) => {
        if (err) {
          reject(err);
        } else {
          resolve(stream);
        }
      });
    });
  }
}
