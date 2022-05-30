"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const http_1 = __importDefault(require("http"));
const logging_1 = __importDefault(require("./settings/logging"));
const variables_1 = __importDefault(require("./settings/variables"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = require('./app/app');
/** Server Handling */
const httpServer = http_1.default.createServer(app);
/** Connect to Mongo */
mongoose_1.default
    .connect(variables_1.default.mongo.url, variables_1.default.mongo.options)
    .then(() => {
    logging_1.default.info('DB Connection Successfull!');
})
    .catch((error) => {
    logging_1.default.error(error);
});
/** Listen */
httpServer.listen(variables_1.default.server.port, () => logging_1.default.info(`Server is running ${variables_1.default.server.hostname}:${variables_1.default.server.port}`));
//# sourceMappingURL=server.js.map