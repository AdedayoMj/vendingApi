"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logging_1 = __importDefault(require("../settings/logging"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("../routes/user"));
const product_1 = __importDefault(require("../routes/product"));
const transaction_1 = __importDefault(require("../routes/transaction"));
const auth_1 = __importDefault(require("../routes/auth"));
const errorHandler = require('../settings/errorHandler');
const { logger } = require('../settings/logEvents');
const corsOptions = require('../settings/corsOptions');
const app = (0, express_1.default)();
/** Rules of our API */
app.use((0, cors_1.default)(corsOptions));
/**use helmet to secure gttp headers */
app.use((0, helmet_1.default)());
/**logger */
// app.use(logger())
/** Log the request */
app.use((req, res, next) => {
    logging_1.default.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging_1.default.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
/** Parse the body of the request */
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
/** Routes */
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
app.use('/api/transact', transaction_1.default);
app.use('/api/product', product_1.default);
/** Error handling */
app.use(errorHandler);
module.exports = app;
//# sourceMappingURL=app.js.map