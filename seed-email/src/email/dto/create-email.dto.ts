import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailDto {
  @ApiProperty({
    description: 'email to Notification',
    example: 'dinotongo@gmail.com',
    default: 'dinotongo@gmail.com',
    required: true,
  })
  to: string;

  @ApiProperty({
    description: 'email subject',
    example: 'email subject',
    default: 'default Subject',
    required: true,
  })
  subject: string;

  @ApiProperty({
    description: 'email text',
    example: 'test seed email',
    default: 'default email text',
    required: true,
  })
  text: string;
}
