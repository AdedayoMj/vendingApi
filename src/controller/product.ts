import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import Product from '../models/product';
import mongoose from 'mongoose';
import multer from 'multer'

import Joi from 'joi';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().toISOString()}${file.originalname}`);
    }
})

const fileFilter = (req: any, file: { mimetype: string; }, cb: (arg0: null, arg1: boolean) => void) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter

});

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to create new products ...');
    try {
        const schema = Joi.object({
            productName: Joi.string().min(5).max(30).required(),
            amountAvailable: Joi.number().min(1).max(30).required(),
            cost: Joi.number().min(1).max(30).required(),
            sellerId: Joi.string().min(1).max(30),
        })

        const { error } = schema.validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)


        let { productName, amountAvailable, cost, sellerId } = req.body;

        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            productName,
            amountAvailable,
            cost,
            sellerId,
            productImage: req.file?.path
        });

        await product.save()
        return res.status(201).json({ message: "Product added" });
    } catch (error) {
        logging.error(error);

        return res.status(500).json({
            message: error
        });
    }
};

const findProduct = async(req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.productID;
    logging.info(`Incoming query for product with id ${_id}`);
    
    try {
      let productData = await Product.findOne({ _id }).exec()
      if (!productData) return res.status(400).send({ message: 'Product not found...' });
      return res.status(200).json({ productData });
    } catch (error) {
      logging.error(error)
      return res.status(500).json(error)
    }
   
};

const getAllProduct = async(req: Request, res: Response, next: NextFunction) => {
    logging.info('Returning all products ');
    try {
        let products = await Product.find().exec()
        if (!products) return res.status(400).send({ message: 'Product list does not exist...' });
        return res.status(200).json({ count: products.length,
            products: products });
      } catch (error) {
        logging.error(error)
        return res.status(500).json(error)
      }
};


const updateProduct = async(req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to update product ...');

    const _id = req.params.productID;

    const schema = Joi.object({
        productName: Joi.string().min(5).max(30),
        amountAvailable: Joi.number().min(1).max(30),
        cost: Joi.number().min(1).max(30),
        sellerId: Joi.string().min(1).max(30),
    })
      const { error } = schema.validate(req.body)
      if (error) return res.status(400).send(error.details[0].message)
      try {
    
        let response = await Product.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
        if (!response) return res.status(400).send({ message: 'Product information not updated!' });
        return res.status(201).json({ message: 'Product data have been modified!' })
    
      } catch (error) {
        logging.error(error)
    
        return res.status(500).json({
          message: error
        })
      }
};

const deleteProduct = async(req: Request, res: Response, next: NextFunction) => {
    logging.warn('Delete product ... ');

    const _id = req.params.productID;

  try {
    await Product.findByIdAndDelete(_id).exec()
    return res.status(201).json({ message: 'User data deleted' })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
};

export default {
    upload,
    addProduct,
    findProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
};
