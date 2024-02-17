import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Consumer, EachMessagePayload, Kafka, logLevel } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown {
  private kafkaGroupId = `fileUpload-consumer`;
  private kafka: Kafka;
  private consumer: Consumer;
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
  }

  async kafkaInitProcess(
    topic: string,
    processMessageFn: (message: string) => void,
  ) {
    this.consumer = this.kafka.consumer({
      groupId: this.kafkaGroupId + '-' + topic,
    });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumeMessages(processMessageFn);
    console.log(`🎉kafka consumer topic: ${topic} is Ready!`);
  }

  async onApplicationShutdown() {
    await this.consumer.disconnect();
  }

  async OnBeforeUnloadEventHandlerNonNull() {
    await this.consumer.disconnect();
  }

  async subscribeToTopic(topic: string) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
  }

  async consumeMessages(processMessageFn: (message: string) => void) {
    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        const messageValue = message.value.toString();
        if (this.envLogLevel >= 1) {
          console.log(`📝Received message on topic ${topic}`);
        }

        if (this.envLogLevel >= 5) {
          console.log(
            `📝Received message on topic ${topic}: ${message.value.toString()}`,
          );
        }

        // Call the custom message processing function provided by the component
        await processMessageFn(messageValue);
      },
    });
  }
}
