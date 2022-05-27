
import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';

import Product from '../models/product';
import ProductData from '../interfaces/eventType';
import User from '../models/users'
import IUser from '../interfaces/eventType';

const buyProduct = (req: Request, res: Response, next: NextFunction) => {


    let { productId,quatity, } = req.body;
    logging.info(`Attempting  to puchase product ${productId}`);

    Product.findById(productId)
    .populate('reader')
    .exec()
    .then((stats) => {
        if (stats) {

            const {productName }: ProductData = stats


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