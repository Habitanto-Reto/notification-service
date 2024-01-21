import mongoose from 'mongoose';
import User, { IUser } from "./userModel";

export class Database {
    private readonly mongoUri: string;

    constructor(mongoUri: string) {
        this.mongoUri = mongoUri;
    }

    async connect(): Promise<void> {
        console.log('🛢 Conectando a MongoDB🍃...');
        try {
            await mongoose.connect(this.mongoUri);
            console.log('Conexión a MongoDB🍃 establecida 🟢');
        } catch (err) {
            console.error('Error conectando a MongoDB ⛔', err, 'URI: ', this.mongoUri);
        }
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return User.findOne({ uuid: userId }).exec();
    }
}
