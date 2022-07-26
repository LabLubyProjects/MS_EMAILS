import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: 'ms_emails',
  brokers: ['localhost:9092']
});

export const kafkaConsumer = kafka.consumer({ groupId: 'emails' });