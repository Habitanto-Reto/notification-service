import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import {Database} from "./models/database";
import {MailSender} from "./utils/mailSender";

class KafkaConsumer {
    private consumer: Consumer;
    private database: Database;
    private mailSender: MailSender;

    constructor(brokers: string[], groupId: string, topic: string, database: Database, mailSender: MailSender) {
        const kafka = new Kafka({ brokers });
        this.consumer = kafka.consumer({ groupId });
        this.database = database;
        this.mailSender = mailSender;

        this.connectAndConsume(topic).catch(error => {
            console.error('Error in KafkaConsumer:', error);
            process.exit(1);
        });
    }

    private async connectAndConsume(topic: string) {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic, fromBeginning: true });

        await this.consumer.run({
            eachMessage: async ({ message }: EachMessagePayload) => {
                const payload = message.value ? JSON.parse(message.value.toString()) : null;
                console.log('Message received:', payload);
                if (payload && payload.creatorUserId && payload.task && payload.title) {
                    const creatorUserId = payload.creatorUserId;
                    const task = payload.task;
                    const title = payload.title;
                    console.log(`Processing message from creatorUserId: ${creatorUserId}`);

                    const user = await this.database.findUserById(creatorUserId);
                    if (user) {
                        console.log('Usuario encontrado:', user.name);
                        await this.mailSender.sendEmail(
                            user.email,
                            "Tarea Completada: " + title,
                            "Hola " + user.name + ",\n\nTu tarea '" + title + "' ha sido completada exitosamente.\n\nDetalles de la tarea:\n" + task,
                            "<h1>Tarea Completada: " + title + "</h1><p>Hola " + user.name + ",<br><br>Tu tarea '<strong>" + title + "</strong>' ha sido completada exitosamente.</p><p>Detalles de la tarea:<br>" + task + "</p>"
                        );
                    } else {
                        console.log('Usuario no encontrado');
                    }
                }
            },
        });
    }
}

export default KafkaConsumer;