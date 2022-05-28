"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const product_1 = __importDefault(require("../models/product"));
const mongoose_1 = __importDefault(require("mongoose"));
const addProduct = (req, res, next) => {
    logging_1.default.info('Attempting to create new stats ...');
    let { productName, amountAvailable, cost, sellerId } = req.body;
    const stats = new product_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        productName,
        amountAvailable,
        cost,
        sellerId
    });
    return stats
        .save()
        .then((newProduct) => {
        logging_1.default.info(`New product added`);
        return res.status(201).json({ product: newProduct });
    })
        .catch((error) => {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
const readProduct = (req, res, next) => {
    const _id = req.params.productID;
    logging_1.default.info(`Incoming query for product with id ${_id}`);
    product_1.default.findById(_id)
        .populate('reader')
        .exec()
        .then((stats) => {
        if (stats) {
            return res.status(200).json({ stats });
        }
        else {
            return res.status(404).json({
                error: 'Stats not found.'
            });
        }
    })
        .catch((error) => {
        logging_1.default.error(error.message);
        return res.status(500).json({
            error: error.message
        });
    });
};
const readAllProduct = (req, res, next) => {
    logging_1.default.info('Returning all blogs ');
    product_1.default.find()
        .populate('reader')
        .exec()
        .then((stats) => {
        return res.status(200).json({
            count: stats.length,
            stats: stats
        });
    })
        .catch((error) => {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
const query = (req, res, next) => {
    logging_1.default.info('Query route called');
    product_1.default.find(req.body)
        .populate('reader')
        .exec()
        .then((stats) => {
        return res.status(200).json({
            count: stats.length,
            stats: stats
        });
    })
        .catch((error) => {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
const update = (req, res, next) => {
    logging_1.default.info('Update route called');
    const _id = req.params.statID;
    product_1.default.findById(_id)
        .exec()
        .then((stats) => {
        if (stats) {
            stats.set(req.body);
            stats.save()
                .then((savedCourse) => {
                logging_1.default.info(`Html stats with id ${_id} updated`);
                return res.status(201).json({
                    stats: savedCourse
                });
            })
                .catch((error) => {
                logging_1.default.error(error.message);
                return res.status(500).json({
                    message: error.message
                });
            });
        }
        else {
            return res.status(401).json({
                message: 'NOT FOUND'
            });
        }
    })
        .catch((error) => {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
const deleteStats = (req, res, next) => {
    logging_1.default.warn('Delete route called');
    const _id = req.params.statID;
    product_1.default.findByIdAndDelete(_id)
        .exec()
        .then(() => {
        return res.status(201).json({
            message: 'html stats deleted'
        });
    })
        .catch((error) => {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
exports.default = {
    addProduct,
    readProduct,
    readAllProduct,
    query,
    update,
    deleteStats
};
//# sourceMappingURL=product.js.map