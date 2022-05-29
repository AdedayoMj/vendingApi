import mongoose, { Schema } from 'mongoose'
import ProductData from '../interfaces/eventType'

const ProductSchema: Schema = new Schema(
  {

    productName: { type: String, required: true, unique: true },
    amountAvailable: { type: Number, required: true },
    cost: { type: Number, required: true },
    productImage: { type: String, required: false },
    sellerId: { type: String, required: true, }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<ProductData>('Product', ProductSchema)