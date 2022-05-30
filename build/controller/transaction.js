"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../settings/logging"));
const product_1 = __importDefault(require("../models/product"));
const transaction_1 = __importDefault(require("../models/transaction"));
const users_1 = __importDefault(require("../models/users"));
const checkArray_1 = require("../_helpers/checkArray");
const mongoose_1 = __importDefault(require("mongoose"));
const buyProduct = async (req, res, next) => {
    const _id = req.params.userID;
    let { productId, quantity, } = req.body;
    logging_1.default.info(`Attempting  to puchase product ${productId}`);
    try {
        const [user, product] = await Promise.all([users_1.default.findById(_id).exec(), product_1.default.findById(productId).exec()]);
        if (user && product) {
            let { cost, productName } = product;
            let { deposit, name } = user;
            const productTotalPrice = cost * quantity;
            const calculateChange = deposit - productTotalPrice;
            product_1.default.findOneAndUpdate({ productName }, { $inc: { amountAvailable: -quantity } }, { new: true }, (err, doc) => {
                if (err)
                    return res.status(500).json({
                        message: err.message
                    });
            });
            users_1.default.findOneAndUpdate({ name }, { $set: { deposit: calculateChange } }, { new: true }, (err, doc) => {
                if (err)
                    return res.status(500).json({
                        message: err.message
                    });
            });
            const transaction = new transaction_1.default({
                _id: new mongoose_1.default.Types.ObjectId(),
                productName: productName,
                quantityPurchased: quantity,
                cost: productTotalPrice,
                buyerId: user._id
            });
            transaction.save().then(() => {
                let checkAmountToDepositEnabled = (0, checkArray_1.checkArray)(calculateChange);
                return res.status(200).json({
                    productPurchased: productName,
                    amountSpent: productTotalPrice,
                    availableBalance: checkAmountToDepositEnabled
                });
            });
        }
    }
    catch (error) {
        logging_1.default.error(error);
        return res.status(500).json({
            error: error
        });
    }
};
const deposit = (req, res, next) => {
    const _id = req.params.userID;
    logging_1.default.info(`Deposit route called`);
    let { deposit } = req.body;
    let checkAmountToDepositEnabled = (0, checkArray_1.checkArray)(deposit);
    if (checkAmountToDepositEnabled) {
        users_1.default.findByIdAndUpdate({ _id: req.params.userID }, { $inc: { deposit: deposit } }, { new: true }, (err, doc) => {
            if (err)
                return res.status(500).json({
                    message: err.message
                });
            return res.status(201).json({
                response: doc,
                message: 'Amount deposited',
            });
        });
    }
    else {
        return res.status(500).json({
            message: 'Currency not accepted'
        });
    }
};
const reset = (req, res, next) => {
    const _id = req.params.userID;
    logging_1.default.info(`reset deposit route called`);
    users_1.default.findByIdAndUpdate({ _id: req.params.userID }, { $set: { deposit: 0 } }, { new: true }, (err, doc) => {
        if (err)
            return res.status(500).json({
                message: err.message
            });
        return res.status(201).json({
            response: doc,
            message: 'Debosit cleared',
        });
    });
};
exports.default = {
    reset,
    deposit,
    buyProduct
};
//# sourceMappingURL=transaction.js.map