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

  @prop()
  amountAvailable: number;

  @prop()
  cost: number;

  @prop()
  sellerId: string;

}

// Create the user model from the User class
const productModel = getModelForClass(Product);
export default productModel;

