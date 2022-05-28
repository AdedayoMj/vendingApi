"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const product_1 = __importDefault(require("../models/product"));
const buyProduct = (req, res, next) => {
    let { productId, quatity, } = req.body;
    logging_1.default.info(`Attempting  to puchase product ${productId}`);
    product_1.default.findById(productId)
        .populate('reader')
        .exec()
        .then((stats) => {
        if (stats) {
            const { productName } = stats;
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
//# sourceMappingURL=transaction.js.map