import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import Product from '../models/product';
import mongoose from 'mongoose';

const addProduct = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to create new stats ...');

    let { productName,amountAvailable,cost,sellerId} = req.body;

    const stats = new Product({
        _id: new mongoose.Types.ObjectId(),
        productName,
        amountAvailable,
        cost,
        sellerId
    });

    return stats
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
        .populate('reader')
        .exec()
        .then((stats) => {
            if (stats) {
                return res.status(200).json({ stats });
            } else {
                return res.status(404).json({
                    error: 'Stats not found.'
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
    logging.info('Returning all blogs ');

    Product.find()
        .populate('reader')
        .exec()
        .then((stats) => {
            return res.status(200).json({
                count: stats.length,
                stats: stats
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
        .populate('reader')
        .exec()
        .then((stats) => {
            return res.status(200).json({
                count: stats.length,
                stats: stats
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.statID;

    Product.findById(_id)
        .exec()
        .then((stats) => {
            if (stats) {
                stats.set(req.body);
                stats.save()
                    .then((savedCourse) => {
                        logging.info(`Html stats with id ${_id} updated`);

                        return res.status(201).json({
                            stats: savedCourse
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

const deleteStats= (req: Request, res: Response, next: NextFunction) => {
    logging.warn('Delete route called');

    const _id = req.params.statID;

    Product.findByIdAndDelete(_id)
        .exec()
        .then(() => {
            return res.status(201).json({
                message: 'html stats deleted'
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
    addProduct,
    readProduct,
    readAllProduct,
    query,
    update,
    deleteStats
};
