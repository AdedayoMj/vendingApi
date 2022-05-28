
import http from 'http'
import express from 'express'
import logging from './config/logging'
import config from './config/config'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'

import userRoutes from './routes/user'
import productsRoutes from './routes/product'
import transactionsRoutes from './routes/transaction'


const errorHandler = require('./config/errorHandler')
const { logger } = require('./config/logEvents');
const router = express()



/** Server Handling */
const httpServer = http.createServer(router)

/** allow cors */
router.use(cors())

/**use helmet to secure gttp headers */
router.use(helmet())


router.use(logger);

/** Connect to Mongo */

mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then(() => {
        logging.info('DB Connection Successfull!')
    })
    .catch((error: any) => {
        logging.error(error)
    })


/** Log the request */
router.use((req, res, next) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

    res.on('finish', () => {
        logging.info(
            `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
        )
    })

    next()
})

/** Parse the body of the request */
router.use(express.urlencoded({ extended: true }))
router.use(express.json())

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }

    next()
})

/** Routes */
router.use('/api/user', userRoutes)
router.use('/api/transact', transactionsRoutes)
router.use('/api/product', productsRoutes)

/** Error handling */
router.use(errorHandler);

/** Listen */
httpServer.listen(config.server.port, () =>
    logging.info(`Server is running ${config.server.hostname}:${config.server.port}`)
)