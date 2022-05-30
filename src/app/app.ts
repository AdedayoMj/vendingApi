
import express from 'express'
import logging from '../settings/logging'
import helmet from 'helmet'
import cors from 'cors'

import userRoutes from '../routes/user'
import productsRoutes from '../routes/product'
import transactionsRoutes from '../routes/transaction'
import authRoutes from '../routes/auth'


const errorHandler = require('../settings/errorHandler')
const { logger } = require('../settings/logEvents');
const corsOptions = require('../settings/corsOptions');


const app = express()

/** Rules of our API */
app.use(cors(corsOptions))




/**use helmet to secure gttp headers */
app.use(helmet())

/**logger */
// app.use(logger())



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


/** Routes */
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/transact', transactionsRoutes)
app.use('/api/product', productsRoutes)

/** Error handling */
app.use(errorHandler);

module.exports =app