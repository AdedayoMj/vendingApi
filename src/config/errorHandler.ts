import { NextFunction, Request, Response } from 'express';
import logging from './logging';

const { logEvents } = require('./logEvents');

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction)=> {
    logging.error(err.message)
    console.error(err.stack)
    res.status(500).send(err.message);
}

module.exports = errorHandler;