import mongoose, { Schema } from 'mongoose'
import IUser from '../interfaces/eventType'

const UserSchema: Schema = new Schema(
  {

    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deposit: { type: Number, default: 0  },
    role: { type: String, default: 'buyer'  },
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IUser>('User', UserSchema)