"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const users_1 = __importDefault(require("../models/users"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signJWT_1 = __importDefault(require("../_helpers/signJWT"));
const joi_1 = __importDefault(require("joi"));
const registerUser = async (req, res, next) => {
    logging_1.default.info('Attempting to create user ...');
    let { name, role, deposit, password } = req.body;
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
    let user = await users_1.default.findOne({ name });
    if (user)
        return res.status(400).send('User already exist ...');
    const _user = new users_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name,
        password,
        deposit,
        role
    });
    const salt = await bcryptjs_1.default.genSalt(10);
    _user.password = await bcryptjs_1.default.hash(_user.password, salt);
    const userData = await _user.save();
    (0, signJWT_1.default)(userData, (_error, token) => {
        if (_error) {
            return res.status(500).json({
                message: _error.message,
                error: _error
            });
        }
        else if (token) {
            return res.status(200).json({
                message: 'Auth successful',
                token: token,
                user: userData
            });
        }
    });
};
const loginUser = async (req, res, next) => {
    logging_1.default.info('Attempting to login...');
    console.log(req.body);
    try {
        let { name, password } = req.body;
        const schema = joi_1.default.object({
            name: joi_1.default.string().min(3).max(30).required(),
            password: joi_1.default.string().min(3).max(30).required(),
        });
        const { error } = schema.validate(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        let user = await users_1.default.findOne({ name });
        if (!user)
            return res.status(400).send({ message: 'Invalid  name or password...' });
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid)
            return res.status(401).json({ message: 'Password Mismatch' });
        (0, signJWT_1.default)(user, (_error, token) => {
            if (_error) {
                return res.status(500).json({
                    message: _error.message,
                    error: _error
                });
            }
            else if (token) {
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token,
                    user: user
                });
            }
        });
    }
    catch (error) {
        res.status(500).send({ message: error });
    }
};
exports.default = {
    registerUser,
    loginUser,
};
//# sourceMappingURL=auth.js.map