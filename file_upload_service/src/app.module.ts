import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from './file_upload/file_upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    FileUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
