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
const NAMESPACE = 'Users';
const validateToken = (req, res, next) => {
    logging_1.default.info(NAMESPACE, 'Token validated, user authorized.');
    return res.status(200).json({
        message: 'Token(s) validated'
    });
};
const registerUser = (req, res, next) => {
    logging_1.default.info('Attempting to create user ...');
    let { name, role, deposit, password } = req.body;
    bcryptjs_1.default.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }
        const _user = new users_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            name,
            password: hash,
            deposit,
            role
        });
        return _user
            .save()
            .then((newUser) => {
            logging_1.default.info('New user  data created');
            return res.status(201).json({ user: newUser });
        })
            .catch((error) => {
            logging_1.default.error(error.message);
            return res.status(500).json({
                message: error.message
            });
        });
    });
};
const loginUser = (req, res, next) => {
    logging_1.default.info('Attempting to login...');
    let { name, password } = req.body;
    users_1.default.find({ name })
        .exec()
        .then((users) => {
        if (users.length !== 1) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        bcryptjs_1.default.compare(password, users[0].password, (error, result) => {
            if (error) {
                return res.status(401).json({
                    message: 'Password Mismatch'
                });
            }
            else if (result) {
                (0, signJWT_1.default)(users[0], (_error, token) => {
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
                            user: users[0]
                        });
                    }
                });
            }
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
const findUser = (req, res, next) => {
    const _id = req.params.userID;
    logging_1.default.info(`Incoming read for user data with id ${_id}`);
    users_1.default.findById(_id)
        .select('-password')
        .populate('name')
        .exec()
        .then((user) => {
        if (user) {
            return res.status(200).json({ user });
        }
        else {
            return res.status(404).json({
                error: 'Information not found.'
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
const update = (req, res, next) => {
    logging_1.default.info('Update route called');
    const _id = req.params.userID;
    users_1.default.findById(_id)
        .exec()
        .then((user) => {
        if (user) {
            user.set(req.body);
            user.save()
                .then((savedUser) => {
                logging_1.default.info(`User with id ${_id} updated`);
                return res.status(201).json({
                    message: 'User information updated'
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
const getAllUsers = (req, res, next) => {
    logging_1.default.info('Returning all Users data information ');
    users_1.default.find()
        .select('-password')
        .populate('name')
        .exec()
        .then((user) => {
        return res.status(200).json({
            count: user.length,
            user: user
        });
    })
        .catch((error) => {
        logging_1.default.error(error.message);
        return res.status(500).json({
            message: error.message
        });
    });
};
const deleteUserData = (req, res, next) => {
    logging_1.default.warn('Delete route called');
    const _id = req.params.userID;
    users_1.default.findByIdAndDelete(_id)
        .exec()
        .then(() => {
        return res.status(201).json({
            message: 'User data deleted'
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
    validateToken,
    registerUser,
    loginUser,
    findUser,
    update,
    getAllUsers,
    deleteUserData
};
//# sourceMappingURL=user.js.map