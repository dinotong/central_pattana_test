import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { KafkaConsumerService } from 'src/kafka/kafka.consumer.service';

interface IKafkaConsumer {
  emailNotification: string;
  fileName: string;
  url: string;
}

@Injectable()
export class EmailService implements OnModuleInit {
  constructor(
    private readonly mailerService: MailerService,

    // kafka
    private kafkaConsumerService: KafkaConsumerService,
  ) {}

  async onModuleInit() {
    this.kafkaConsumerService.kafkaInitProcess(
      'email-notification',
      this.processMessage.bind(this),
    );
  }

  async processMessage(message: string) {
    const consumeData: IKafkaConsumer = JSON.parse(message) as IKafkaConsumer;
    console.log('consumeData', consumeData);

    const subject = 'Upload Successful';
    const fileUrl = consumeData.url + consumeData.fileName;
    const text = `
      Upload Successful
      Hello ${consumeData.emailNotification},
      We're pleased to inform you that your file upload was successful!
      Download File: ${fileUrl}
      Thank you for using our service.
      Best regards,
      Our Team`;

    await this.sendEmail({
      to: consumeData.emailNotification,
      subject: subject,
      text: text,
    });
  }

  async sendEmail(emailData: CreateEmailDto): Promise<SentMessageInfo> {
    return await this.mailerService.sendMail({
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
    });
  }

  create(createEmailDto: CreateEmailDto) {
    return 'This action adds a new email';
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
