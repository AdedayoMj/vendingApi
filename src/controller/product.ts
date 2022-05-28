import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import Product from '../models/product';
import mongoose from 'mongoose';
import multer from 'multer'

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

const addProduct = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to create new products ...');

    console.log(req.file)

    let { productName, amountAvailable, cost, sellerId } = req.body;

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        productName,
        amountAvailable,
        cost,
        sellerId,
        productImage: req.file?.path
    });

    return product
        .save()
        .then((newProduct) => {
            logging.info(`New product added`);

            return res.status(201).json({ product: newProduct });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const readProduct = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.productID;
    logging.info(`Incoming query for product with id ${_id}`);

    Product.findById(_id)
        .exec()
        .then((product) => {
            if (product) {
                return res.status(200).json({ product });
            } else {
                return res.status(404).json({
                    error: 'product not found.'
                });
            }
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                error: error.message
            });
        });
};

const readAllProduct = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Returning all products ');

    Product.find()
        .exec()
        .then((product) => {
            return res.status(200).json({
                count: product.length,
                product: product
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const query = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Query route called');

    Product.find(req.body)
        .exec()
        .then((product) => {
            return res.status(200).json({
                count: product.length,
                product: product
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const updateProduct = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.productID;

    Product.findById(_id)
        .exec()
        .then((product) => {
            if (product) {
                product.set(req.body);
                product.save()
                    .then((savedCourse) => {
                        logging.info(`Html stats with id ${_id} updated`);

                        return res.status(201).json({
                            product: savedCourse
                        });
                    })
                    .catch((error) => {
                        logging.error(error.message);

                        return res.status(500).json({
                            message: error.message
                        });
                    });
            } else {
                return res.status(401).json({
                    message: 'NOT FOUND'
                });
            }
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
    logging.warn('Delete route called');

    const _id = req.params.productID;

    Product.findByIdAndDelete(_id)
        .exec()
        .then(() => {
            return res.status(201).json({
                message: 'product deleted'
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

export default {
    upload,
    addProduct,
    readProduct,
    readAllProduct,
    query,
    updateProduct,
    deleteProduct
};
