import mongoose, { Schema } from 'mongoose'
import ProductData from '../interfaces/eventType'

const ProductSchema: Schema = new Schema(
  {

    productName: { type: String, required: true, unique: true },
    amountAvailable: { type: Number, required: true },
    cost: { type: Number, required: true  },
    role: { type: String,  default: 'buyer'  },
    sellerid: { type:Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<ProductData>('Product', ProductSchema)