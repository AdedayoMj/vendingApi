"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { logEvents } = require('./logEvents');
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack);
    res.status(500).send(err.message);
};
module.exports = errorHandler;
//# sourceMappingURL=errorHandler.js.map