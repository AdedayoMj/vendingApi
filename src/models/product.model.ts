import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';

@index({ productName: 1 })
@pre<Product>('save', function () {
})

@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})


// Export the User class to be used as TypeScript type
export class Product {
  @prop({ unique: true, required: true })
  productName: string;

  @prop({ required: true })
  amountAvailable: number;

  @prop({ required: true })
  cost: number;

  @prop()
  sellerId: string;

  @prop()
  productImages?: string;

}

// Create the user model from the User class
const productModel = getModelForClass(Product);
export default productModel;

