import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileUploadService } from './file_upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('file')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const fileName = file.originalname;
    const fileContent = file.buffer;
    const etag = await this.fileUploadService.uploadFile(fileName, fileContent);

    return {
      statusCode: 200,
      message: 'Successful',
      data: {
        fileName: fileName,
        etag: etag,
      },
    };
  }

  @Get(':fileName')
  async downloadFileByName(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    try {
      const fileStream = await this.fileUploadService.getFileByName(fileName);
      res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-type', 'application/octet-stream');
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: 'Failed to download file' });
    }
  }
}
