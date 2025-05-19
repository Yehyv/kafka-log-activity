// src/logs/logs.module.ts
import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { KafkaProducerService } from './kafka-producer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './logs.schema';
import { KafkaConsumerService } from './kafka-consumer.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  controllers: [LogsController],
  providers: [LogsService, KafkaProducerService,KafkaConsumerService],
})
export class LogsModule {}
