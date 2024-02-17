import { Module } from '@nestjs/common';
import { FileUploadService } from './file_upload.service';
import { FileUploadController } from './file_upload.controller';
import { KafkaProducerService } from 'src/kafka/kafka.producer.service';

@Module({
  imports: [],
  controllers: [FileUploadController],
  providers: [FileUploadService, KafkaProducerService],
})
export class FileUploadModule {}
