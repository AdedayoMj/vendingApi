
import { NextFunction, Request, Response } from 'express';
import logging from '../settings/logging';

import Product from '../models/product';
import Transaction from '../models/transaction';
import User from '../models/users'
import { checkArray } from '../_helpers/checkArray';
import mongoose from 'mongoose';

const buyProduct = async (req: Request, res: Response, next: NextFunction) => {

    const _id = req.params.userID
    let { productId, quantity, } = req.body;
    logging.info(`Attempting  to puchase product ${productId}`);
    try {
        const [user, product] = await Promise.all([User.findById(_id).exec(), Product.findById(productId).exec()])
        if (user && product) {
            let { cost, productName } = product
            let { deposit, name } = user
            const productTotalPrice = cost * quantity
            const calculateChange = deposit - productTotalPrice

            Product.findOneAndUpdate({ productName }, { $inc: { amountAvailable: - quantity } }, { new: true }, (err, doc) => {
                if (err) return res.status(500).json({
                    message: err.message
                });
            })
            User.findOneAndUpdate({ name }, { $set: { deposit: calculateChange } }, { new: true }, (err, doc) => {
                if (err) return res.status(500).json({
                    message: err.message
                });
            })

            const transaction = new Transaction({
                _id: new mongoose.Types.ObjectId(),
                productName: productName,
                quantityPurchased: quantity,
                cost: productTotalPrice,
                buyerId: user._id
            });
            transaction.save().then(() => {
                let checkAmountToDepositEnabled = checkArray(calculateChange)
                return res.status(200).json({
                    productPurchased: productName,
                    amountSpent: productTotalPrice,
                    availableBalance: checkAmountToDepositEnabled
                });
            })
        }

    } catch (error) {
        logging.error(error);

        return res.status(500).json({
            error: error
        });
    }
}




const deposit = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.userID
    logging.info(`Deposit route called`)

    let { deposit } = req.body
    let checkAmountToDepositEnabled = checkArray(deposit)
    if (checkAmountToDepositEnabled) {

        User.findByIdAndUpdate({ _id: req.params.userID }, { $inc: { deposit: deposit } }, { new: true }, (err, doc) => {
            if (err) return res.status(500).json({
                message: err.message
            });
            return res.status(201).json({
                response: doc,
                message: 'Amount deposited',

            });
        })
    } else {
        return res.status(500).json({
            message: 'Currency not accepted'
        })
    }
}


const reset = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.userID
    logging.info(`reset deposit route called`)

    User.findByIdAndUpdate({ _id: req.params.userID }, { $set: { deposit: 0 } }, { new: true }, (err, doc) => {
        if (err) return res.status(500).json({
            message: err.message
        });
        return res.status(201).json({
            response: doc,
            message: 'Debosit cleared',

        });
    })
}


export default {
    reset,
    deposit,
    buyProduct
}