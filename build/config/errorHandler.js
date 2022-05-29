"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("./logging"));
const { logEvents } = require('./logEvents');
const errorHandler = (err, req, res, next) => {
    logging_1.default.error(err.message);
    console.error(err.stack);
    res.status(500).send(err.message);
};
module.exports = errorHandler;
//# sourceMappingURL=errorHandler.js.map