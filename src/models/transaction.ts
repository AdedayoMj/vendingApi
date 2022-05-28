import mongoose, { Schema } from 'mongoose'
import TransactionData from '../interfaces/eventType'

const TransactionSchema: Schema = new Schema(
    {

        productName: { type: String, required: true, unique: true },
        quantityPurchased: { type: Number, required: true },
        cost: { type: Number, required: true },
        buyerId: { type: String, required: true, unique: true }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<TransactionData>('Transaction', TransactionSchema)