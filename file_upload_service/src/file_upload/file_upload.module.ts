import { Module } from '@nestjs/common';
import { FileUploadService } from './file_upload.service';
import { FileUploadController } from './file_upload.controller';

@Module({
  imports: [],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
