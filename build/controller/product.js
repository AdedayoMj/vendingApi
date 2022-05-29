"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const product_1 = __importDefault(require("../models/product"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const joi_1 = __importDefault(require("joi"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().toISOString()}${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter
});
const addProduct = async (req, res, next) => {
    var _a;
    logging_1.default.info('Attempting to create new products ...');
    try {
        const schema = joi_1.default.object({
            productName: joi_1.default.string().min(5).max(30).required(),
            amountAvailable: joi_1.default.number().min(1).max(30).required(),
            cost: joi_1.default.number().min(1).max(30).required(),
            sellerId: joi_1.default.string().min(1).max(30),
        });
        const { error } = schema.validate(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        let { productName, amountAvailable, cost, sellerId } = req.body;
        const product = new product_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            productName,
            amountAvailable,
            cost,
            sellerId,
            productImage: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path
        });
        await product.save();
        return res.status(201).json({ message: "Product added" });
    }
    catch (error) {
        logging_1.default.error(error);
        return res.status(500).json({
            message: error
        });
    }
};
const findProduct = async (req, res, next) => {
    const _id = req.params.productID;
    logging_1.default.info(`Incoming query for product with id ${_id}`);
    try {
        let productData = await product_1.default.findOne({ _id }).exec();
        if (!productData)
            return res.status(400).send({ message: 'Product not found...' });
        return res.status(200).json({ productData });
    }
    catch (error) {
        logging_1.default.error(error);
        return res.status(500).json(error);
    }
};
const getAllProduct = async (req, res, next) => {
    logging_1.default.info('Returning all products ');
    try {
        let products = await product_1.default.find().exec();
        if (!products)
            return res.status(400).send({ message: 'Product list does not exist...' });
        return res.status(200).json({ count: products.length,
            products: products });
    }
    catch (error) {
        logging_1.default.error(error);
        return res.status(500).json(error);
    }
};
const updateProduct = async (req, res, next) => {
    logging_1.default.info('Attempting to update product ...');
    const _id = req.params.productID;
    const schema = joi_1.default.object({
        productName: joi_1.default.string().min(5).max(30),
        amountAvailable: joi_1.default.number().min(1).max(30),
        cost: joi_1.default.number().min(1).max(30),
        sellerId: joi_1.default.string().min(1).max(30),
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        let response = await product_1.default.findByIdAndUpdate(_id, { $set: req.body }, { new: true });
        if (!response)
            return res.status(400).send({ message: 'Product information not updated!' });
        return res.status(201).json({ message: 'Product data have been modified!' });
    }
    catch (error) {
        logging_1.default.error(error);
        return res.status(500).json({
            message: error
        });
    }
};
const deleteProduct = async (req, res, next) => {
    logging_1.default.warn('Delete product ... ');
    const _id = req.params.productID;
    try {
        await product_1.default.findByIdAndDelete(_id).exec();
        return res.status(201).json({ message: 'User data deleted' });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
};
exports.default = {
    upload,
    addProduct,
    findProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
};
//# sourceMappingURL=product.js.map