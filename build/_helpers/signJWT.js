"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const variables_1 = __importDefault(require("../settings/variables"));
const logging_1 = __importDefault(require("../settings/logging"));
const NAMESPACE = 'Auth';
const signJWT = (user, callback) => {
    var timeSinceEpoch = new Date().getTime();
    var expirationTime = timeSinceEpoch + Number(variables_1.default.server.token.expireTime) * 100000;
    var expirationTimeInSeconds = Math.floor(expirationTime / 1000);
    logging_1.default.info(NAMESPACE, `Attempting to sign token for ${user._id}`);
    try {
        jsonwebtoken_1.default.sign({
            _id: user._id,
            name: user.name,
            role: user.role
        }, process.env.SERVER_TOKEN_SECRET, {
            issuer: variables_1.default.server.token.issuer,
            algorithm: 'HS256',
            expiresIn: expirationTimeInSeconds,
        }, (error, token) => {
            if (error) {
                callback(error, null);
            }
            else if (token) {
                callback(null, token);
            }
        });
    }
    catch (error) {
        logging_1.default.error(NAMESPACE, error.message);
        callback(error, null);
    }
};
exports.default = signJWT;
//# sourceMappingURL=signJWT.js.map