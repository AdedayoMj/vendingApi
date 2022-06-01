import { object, string, number, array, TypeOf } from 'zod';


const params = {
  params: object({
    productId: string(),
  }),
};


export const createProductSchema = object({
  body: object({
    productName: string({ required_error: 'Product Name is required' }).min(6, 'Name must be more than 6 characters'),
    amountAvailable: number({ required_error: 'Product Name is required' }).positive(),
    cost: number({ required_error: 'Cost of product is required' }).positive(),
    sellerId: string(),
  })
})



export const getAllProductSchema = object({
  query: object({
    productName: string(),
    amountAvailable: number(),
    cost: number(),
  }).partial(),
});

export const getProductSchema = object({
  ...params,
});
export const buyProductSchema = object({
  ...params,
  body: object({
    quantity: string({ required_error: 'Quatity of product is required' })
  })
});


export const updateProductSchema = object({
  ...params,
  body: object({
    productName: string().min(6, 'Name must be more than 6 characters'),
    amountAvailable: number().positive(),
    cost: number().positive(),
  }).partial(),
});

export const deleteProductSchema = object({
  ...params,
});




export type CreateProductInput = TypeOf<typeof createProductSchema>['body'];
export type GetAllProductInput = TypeOf<typeof getAllProductSchema>['query'];
export type GetProductInput = TypeOf<typeof getProductSchema>['params'];
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
export type BuyProductInput = TypeOf<typeof buyProductSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>['params'];
