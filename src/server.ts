
import http from 'http'
import logging from './config/logging'
import config from './config/config'
import mongoose from 'mongoose'
import cors from 'cors'




const app = require ('./app/app')
/** Server Handling */
const httpServer = http.createServer(app)

/** allow cors */
app.use(cors())

/** Connect to Mongo */

mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then(() => {
        logging.info('DB Connection Successfull!')
    })
    .catch((error: any) => {
        logging.error(error)
    })


/** Listen */
httpServer.listen(config.server.port, () =>
    logging.info(`Server is running ${config.server.hostname}:${config.server.port}`)
)