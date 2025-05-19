import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kafka, Consumer } from 'kafkajs';
import { Log, LogDocument } from './logs.schema';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    @InjectModel(Log.name) private logModel: Model<LogDocument>,
  ) {
    this.kafka = new Kafka({
      clientId: 'log-consumer',
      brokers: ['localhost:9092'],
    });
    this.consumer = this.kafka.consumer({ groupId: 'log-consumer-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'user-activity', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        console.log('Received message:', value);  

        if (!value) {
          this.logger.warn('Received empty or undefined message value');
          return;
        }

        try {
          const logData = JSON.parse(value);

          
          if (typeof logData.timestamp === 'string') {
            logData.timestamp = new Date(logData.timestamp);
          }

          const createdLog = new this.logModel(logData);
          await createdLog.save();
          console.log('Saved log to DB:', createdLog);     

          this.logger.log(`Log saved: ${JSON.stringify(logData)}`);
        } catch (error) {
          this.logger.error(`Error processing log message: ${error.message}`);
        }
      },
    });
  }
}
