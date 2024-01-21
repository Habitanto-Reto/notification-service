import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
    uuid: string;
    email: string;
    name: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    uuid: { type: String, default: uuidv4 },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
});

export default mongoose.model<IUser, mongoose.Model<IUser>>('User', UserSchema);