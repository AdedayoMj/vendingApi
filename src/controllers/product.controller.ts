import { Request, Express, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';
import productModel from '../models/product.model';
import {
  CreateProductInput,
  DeleteProductInput,
  GetAllProductInput,
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


const multerStorage = multer.memoryStorage();
const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new Error('Only images are allowed'));
  }
  cb(null, true);
};

const upload = multer({ storage: multerStorage,limits: {
    fileSize: 1024 * 1024 * 2
}, fileFilter: multerFilter });

export const uploadProductImages =upload.single('productImages')

export const resizeProductImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  if (!req.file.productImages) return next();

  req.body.productImages = `product-${req.params.productId}-${Date.now()}-cover.jpeg`;
  // Resize imageCover
  await sharp(req?.file?.path[0])
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${__dirname}/../../public/products/${req.body.productImages}`);

  next();
};

export const createProductHandler = async (
  req: Request<{}, {}, CreateProductInput>,
  res: Response,
  next: NextFunction
) => {
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

export const deleteProductHandler = async (
  req: Request<DeleteProductInput>,
  res: Response,
  next: NextFunction
) => {
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