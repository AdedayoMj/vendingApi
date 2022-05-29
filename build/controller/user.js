"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const users_1 = __importDefault(require("../models/users"));
const joi_1 = __importDefault(require("joi"));
/** find a single user*/
const findUser = async (req, res, next) => {
    const name = req.body.name;
    logging_1.default.info(`Incoming read for user data with username ${name}`);
    try {
        let userData = await users_1.default.findOne({ name }).exec();
        if (!userData)
            return res.status(400).send({ message: 'User not found...' });
        return res.status(200).json({ userData });
    }
    catch (error) {
        logging_1.default.error(error);
        return res.status(500).json(error);
    }
};
/** update user's infomation */
const update = async (req, res, next) => {
    logging_1.default.info('Update route called');
    const _id = req.params.userID;
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).max(30).required(),
        password: joi_1.default.string().min(3).max(30).required(),
        deposit: joi_1.default.number().min(1).max(30)
    }).keys({
        role: joi_1.default.string().valid('buyer', 'seller'),
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        let response = await users_1.default.findByIdAndUpdate(_id, { $set: req.body }, { new: true });
        if (!response)
            return res.status(400).send({ message: 'User information not updated!' });
        return res.status(201).json({ message: 'User data have been modified!' });
    }
    catch (error) {
        logging_1.default.error(error);
        return res.status(500).json({
            message: error
        });
    }
};
/** get all single users*/
const getAllUsers = async (req, res, next) => {
    logging_1.default.info('Returning all Users data information ');
    try {
        let users = await users_1.default.find().exec();
        if (!users)
            return res.status(400).send({ message: 'User list does not exist...' });
        return res.status(200).json({ users });
    }
    catch (error) {
        logging_1.default.error(error);
        return res.status(500).json(error);
    }
};
/** delete a single user*/
const deleteUserData = async (req, res, next) => {
    logging_1.default.warn('Delete route called');
    const _id = req.params.userID;
    try {
        await users_1.default.findByIdAndDelete(_id).exec();
        return res.status(201).json({ message: 'User data deleted' });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
};
exports.default = {
    findUser,
    update,
    getAllUsers,
    deleteUserData
};
//# sourceMappingURL=user.js.map