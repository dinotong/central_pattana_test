import { PartialType } from '@nestjs/mapped-types';
import { CreateFileUploadDto } from './create-file_upload.dto';

export class UpdateFileUploadDto extends PartialType(CreateFileUploadDto) {}
