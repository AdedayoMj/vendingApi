import { Document } from 'mongoose'

export default interface IUser extends Document {
    name: string;
    password: string;
    role: string;
    deposit: number;
}

export default interface ProductData extends Document {
    productName: string;
    amountAvailable: number;
    cost: number;
    sellerId: any;
}

export default interface TransactionData extends Document {
    productName: string;
    quantityPurchased: number;
    cost: number;
    buyerId: string;
}