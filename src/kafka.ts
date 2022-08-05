import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config()
const kafka = new Kafka({
  clientId: 'ms_emails',
  brokers: [`${process.env.KAFKA_CONNECTION}`]
});

export const kafkaConsumer = kafka.consumer({ groupId: 'emails' });