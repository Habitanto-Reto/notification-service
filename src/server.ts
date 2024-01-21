import KafkaConsumer from "./main";
import { Database } from "./models/database";
import {MailSender} from "./utils/mailSender";

async function startServer() {
    if (!process.env.CLIENT_KAFKA_BROKERS) {
        console.error('Missing environment variable KAFKA_BROKER');
        process.exit(1);
    }

    if (!process.env.MAILGUN_API_KEY) {
        console.error('Missing environment variable DB_ADMIN');
        process.exit(1);
    }

    if (!process.env.MAILGUN_DOMAIN) {
        console.error('Missing environment variable MAILGUN_DOMAIN');
        process.exit(1);
    }

    const brokers = [process.env.CLIENT_KAFKA_BROKERS|| 'kafka:9092'];
    const groupId = 'my-consumer-group';
    const topic = 'task-completed';

    const mongoUsername = process.env.DB_ADMIN;
    const mongoPassword = process.env.DB_ADMIN_PWD;
    const mongoDbName = process.env.DB_NAME;
    const mongoHost = process.env.DB_HOST;
    const mongoPort = process.env.DB_PORT;

    const mongoUri = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDbName}`;
    const database = new Database(mongoUri);
    const mailSender = new MailSender(process.env.MAILGUN_API_KEY, process.env.MAILGUN_DOMAIN);

    try {
        await database.connect();
        new KafkaConsumer(brokers, groupId, topic, database, mailSender);
        console.log('Server started successfully');
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

process.on('SIGINT', () => {
    console.log('Closing server...');
    //TODO: close connections
    process.exit(0);
});
