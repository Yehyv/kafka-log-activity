import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";

@Injectable()
export class KafkaProducerService implements OnModuleInit {
    private kafka: Kafka;
    private producer: Producer;


    async onModuleInit() { //Connecting with kafka
        this.kafka = new Kafka({
            clientId: 'log-producer', //Client who will communicate with kafka
            brokers: ['localhost:9092'], //Kafka's address (server and port)
        });

        this.producer = this.kafka.producer(); //make producer ready
        await this.producer.connect(); // connect producer with kafka to be able to send messages to topics
    }

    async sendLog(log:any){ // taking log from controller body as a json 
        await this.producer.send({
            topic: 'user-activity',
            messages: [
                {
                    value: JSON.stringify(log), // transfor im to string to sending it to the topic
                },
            ],
        });
    }

}