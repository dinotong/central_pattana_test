import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    description: 'email to Notification',
    example: 'dinotongo@gamil.com',
    default: 'dinotongo@gamil.com',
    required: true,
  })
  emailNotification: string;
}
