
import productModel, { Product } from '../models/product.model';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';


// CreateUser service
export const createProduct = async (input: Partial<Product>) => {
    return await productModel.create(input);

};

// Find Product
export const getProduct = async (
    query: FilterQuery<Product>,
    options: QueryOptions = { lean: true }
) => {
    return await productModel
        .findOne(query, {}, options)
        .populate({ path: 'productName' });
};


// update Product by any fields
export const updateProduct = async (
    query: FilterQuery<Product>,
    update: UpdateQuery<Product>,
    options: QueryOptions
) => {
    return await productModel.findOneAndUpdate(query, update, options);
};


//delete product
export const deleteProduct = async (query: FilterQuery<Product>) => {
    return await productModel.findOneAndDelete(query);
}