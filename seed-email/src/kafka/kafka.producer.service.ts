import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  Admin,
  ITopicConfig,
  ITopicPartitionConfig,
  Kafka,
  logLevel,
  Message,
  Producer,
  ProducerRecord,
} from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  private kafka: Kafka;
  private producer: Producer;
  private envLogLevel: number = logLevel.WARN;

  constructor(private configService: ConfigService) {
    const kafkaBroker = this.configService.get<string>('KAFKA_BROKERS');
    if (!kafkaBroker) throw Error('KAFKA_BROKERS is required');
    const kafkaBrokers = kafkaBroker.split(',');
    this.envLogLevel =
      this.configService.get<number>('KAFKA_LOG_LEVEL') || logLevel.WARN;

    this.kafka = new Kafka({
      logLevel: this.envLogLevel,
      brokers: kafkaBrokers,
    });

    this.producer = this.kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    return await this.producer.send(record);
  }

  async sendToTopic(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async OnBeforeUnloadEventHandlerNonNull() {
    await this.producer.disconnect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
