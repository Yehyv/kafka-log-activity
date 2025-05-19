import { Inject, Injectable } from "@nestjs/common";
import { KafkaProducerService } from "./kafka-producer.service";
import { Log, LogDocument } from "./logs.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class LogsService{
    constructor(
        private readonly kafkaProducer: KafkaProducerService,
        @InjectModel(Log.name) private logModel: Model<LogDocument>
    ){}

    async sendLog(log:any){ // connecting producer with the controller
        await this.kafkaProducer.sendLog(log);
        return { message: 'Log sent to Kafka'};
    }

    async create(log: Partial<Log>): Promise<Log>{
        const createdLog = new this.logModel(log)
        return createdLog.save();
    }
    async findAll() {
    return this.logModel.find().exec(); // for testing
    }

    async getLogs(page = 1, limit = 10, userId?: string) {
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (userId) filter.userId = userId;

    const logs = await this.logModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ timestamp: -1 })
      .exec();

    const total = await this.logModel.countDocuments(filter);

    return {
      data: logs,
      total,
      page,
      limit,
    };
  }
}