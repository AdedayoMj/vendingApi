
import express from 'express'
import logging from '../utils/logging'
import helmet from 'helmet'
import cors from 'cors'

import userRoutes from '../routes/user.route'
import productsRoutes from '../routes/product.route'
import authRoutes from '../routes/auth.route'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

const errorHandler = require('../settings/errorHandler')
const { logger } = require('../settings/logEvents');
const corsOptions = require('../settings/corsOptions');


const app = express()


/**use helmet to secure gttp headers */
app.use(helmet())

app.use(logger)

app.use(cookieParser())

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

/**logger */
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))


/** Rules of our API */
app.use(cors(corsOptions))

/** Parse the body of the request */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



/** Routes */
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/product', productsRoutes)

/** Error handling */
app.use(errorHandler);

module.exports = app