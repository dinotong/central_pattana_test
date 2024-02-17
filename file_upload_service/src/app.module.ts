import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from './file_upload/file_upload.module';

@Module({
  imports: [ConfigModule.forRoot(), FileUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
