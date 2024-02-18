import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaConsumerService } from 'src/kafka/kafka.consumer.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAILER_HOST'),
          port: configService.get<number>('MAILER_PORT') || 587,
          secure: false,
          auth: {
            user: configService.get<string>('MAILER_USERNAME'),
            pass: configService.get<string>('MAILER_PASSWORD'),
          },
          defaults: {
            from: configService.get<string>('MAILER_USERNAME'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, KafkaConsumerService],
})
export class EmailModule {}
