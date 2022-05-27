const request = require('supertest');
const app = require('../test/testserver');
import mongoose from 'mongoose'
import config from '../config/config';
import logging from '../config/logging';

beforeAll(async () => {
    await mongoose
        .connect(config.mongo.url, config.mongo.options)
        .then(() => {
            logging.info('Mongo Connected')
        })
        .catch((error: any) => {
            logging.error(error)
        })

})
let token: any;


beforeAll(async () => {
    request(app)
        .post('/api/users/login')
        .send({
            name: 'roycetest',
            password: 'test1234',
        })
        .end((err: any, response: { body: { token: any; }; }) => {
            token = response.body.token;
            console.log('this is token', token, response.body)// save the token!

        });
});

afterAll(async () => {
    try {
        await mongoose.connection.close()
    } catch (err) {
        console.log(err)
    }
    // Closing the DB connection allows Jest to exit successfully.


})