
require('dotenv').config();
import http from 'http'
import logging from './settings/logging'
import variableData from './settings/variables'
import mongoose from 'mongoose'

import connectDB from './utils/connectDB';




const app = require ('./app/app')
/** Server Handling */
const httpServer = http.createServer(app)



/** Connect to Mongo */

// mongoose
//     .connect(variableData.mongo.url, variableData.mongo.options)
//     .then(() => {
//         logging.info('DB Connection Successfull!')
//     })
//     .catch((error: any) => {
//         logging.error(error)
//     })


/** Listen */
httpServer.listen(variableData.server.port, () =>{
    logging.info(`Server is running ${variableData.server.hostname}:${variableData.server.port}`),
    connectDB()
}
)