"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('supertest');
const app = require('../test/testserver');
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config/config"));
const logging_1 = __importDefault(require("../config/logging"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default
        .connect(config_1.default.mongo.url, config_1.default.mongo.options)
        .then(() => {
        logging_1.default.info('Mongo Connected');
    })
        .catch((error) => {
        logging_1.default.error(error);
    });
}));
let token;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    request(app)
        .post('/api/users/login')
        .send({
        name: 'roycetest',
        password: 'test1234',
    })
        .end((err, response) => {
        token = response.body.token;
        console.log('this is token', token, response.body); // save the token!
    });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connection.close();
    }
    catch (err) {
        console.log(err);
    }
    // Closing the DB connection allows Jest to exit successfully.
}));
//# sourceMappingURL=route.spec.js.map