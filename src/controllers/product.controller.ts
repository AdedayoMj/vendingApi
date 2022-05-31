import { Request, Express, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';
import productModel from '../models/product.model';
import {
    CreateProductInput,
    DeleteProductInput,
    // GetAllProductInput,
    BuyProductInput,
    GetProductInput,
    UpdateProductInput,
} from '../schemas/product.schema';
import {
    createProduct,
    deleteProduct,
    getProduct,
    updateProduct,
} from '../services/product.service';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';
import { promise } from 'zod';
import logging from '../utils/logging';
import { findAndUpdateUser } from '../services/user.service';




export const createProductHandler = async (
    req: Request<{}, {}, CreateProductInput>,
    res: Response,
    next: NextFunction
) => {
    logging.info(`Attempting  to create product `);
    try {
        const product = await createProduct(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                product,
            },
        });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(409).json({
                status: 'fail',
                message: 'Product with that name already exist',
            });
        }
        next(err);
    }
};

export const getAllProductHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logging.info(`Attempting  to get all product `);
    try {
        const apiFeatures = new APIFeatures(productModel.find(), req.query)
            .filter()
            .sort()
            .limitField()

        const products = await apiFeatures.query;

        res.status(200).json({
            status: 'success',
            result: products.length,
            data: {
                products,
            },
        });
    } catch (err: any) {
        next(err);
    }
};

export const getProductHandler = async (
    req: Request<GetProductInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await getProduct({ _id: req.params.productId });

        if (!product) {
            return next(new AppError('No product with that ID exist', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        });
    } catch (err: any) {
        next(err);
    }
};

export const updateProductHandler = async (
    req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
    res: Response,
    next: NextFunction
) => {

    logging.info(`Attempting  to update product `);
    try {
        const product = await updateProduct({ _id: req.params.productId }, req.body, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return next(new AppError('No Product with that ID exist', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        });
    } catch (err: any) {
        next(err);
    }
};

export const buyProductHandler = async (
    req: Request<BuyProductInput['params'], {}, BuyProductInput['body']>,
    res: Response,
    next: NextFunction
) => {

    logging.info(`Attempting  to puchase product `);

    try {
        let { deposit } = res.locals.user

        const product = await getProduct({ _id: req.params.productId });

        if (!product) {
            return next(new AppError('No product with that ID exist', 404));
        }
        if (product.amountAvailable < req.body.quantity) {
            return next(new AppError('Quantity requested is more than available product ', 404));
        }

        const productTotalPrice = product.cost * req.body.quantity
        const calculateChange = deposit - productTotalPrice

        let newProduct = {
            amountAvailable: (product.amountAvailable - req.body.quantity)
        }
        let newdDeposit = {
            deposit: calculateChange
        }
        await Promise.all([
            updateProduct({ _id: req.params.productId }, newProduct, {
                new: true,
                runValidators: true,
            }),
            findAndUpdateUser({ _id: res.locals.user._id }, newdDeposit, {
                new: true,
                runValidators: true
            })
        ])

        const products = {
            totalprice: productTotalPrice,
            availableChange: calculateChange,
            productName: product.productName
        }
        res.status(200).json({
            status: 'success',
            data: {
                products,
            },
        });

    } catch (err: any) {
        next(err);
    }
    ;

}

export const resetProductHandler = async (
    req: Request<DeleteProductInput>,
    res: Response,
    next: NextFunction
) => {
    logging.info(`Reset deposit route called`)
    try {
        let newdDeposit = {
            deposit: 0
        }

        const user = await findAndUpdateUser({ _id: res.locals.user._id }, newdDeposit, {
            new: false,
            runValidators: true
        })

        res.status(204).json({
            status: 'success',
            data: user,
        });
    } catch (err: any) {
        next(err);
    }
};

export const deleteProductHandler = async (
    req: Request<DeleteProductInput>,
    res: Response,
    next: NextFunction
) => {
    logging.info(`Delete ptoduct route called`)
    try {
        const product = await deleteProduct({ _id: req.params.productId });

        if (!product) {
            return next(new AppError('No document with that ID exist', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err: any) {
        next(err);
    }
};