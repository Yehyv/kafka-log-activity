import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsModule } from './logs/logs.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [    
    MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.zcagdda.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'), // رابط قاعدة البيانات عندك
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'log-producer',
            brokers: ['localhost:9092'],  // مهم جداً يكون الـ broker هنا مضبوط
          },
          consumer: {
            groupId: 'log-consumer-group',
          },
        },
      },
    ])
    ,LogsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
