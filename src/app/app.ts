
import http from 'http'
import express from 'express'
import logging from '../config/logging'
import config from '../config/config'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'


import userRoutes from '../routes/user'
import productsRoutes from '../routes/product'
import transactionsRoutes from '../routes/transaction'


const errorHandler = require('../config/errorHandler')
// const { logger } = require('./config/logEvents');
const app = express()



/** allow cors */
app.use(cors())

/**use helmet to secure gttp headers */
app.use(helmet())


/** Log the request */
app.use((req, res, next) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

    res.on('finish', () => {
        logging.info(
            `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
        )
    })

    next()
})

/** Parse the body of the request */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/uploads',express.static('uploads'))

/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }

    next()
})

/** Routes */
app.use('/api/user', userRoutes)
app.use('/api/transact', transactionsRoutes)
app.use('/api/product', productsRoutes)

/** Error handling */
app.use(errorHandler);

module.exports =app