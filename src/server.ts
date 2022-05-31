
require('dotenv').config();
import http from 'http'
import logging from './utils/logging'
import variableData from './settings/variables'
import { NextFunction, Request, Response } from 'express';
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

/**Testing */
app.get('/healthChecker', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to CodevoWeb',
    });
  });


// UnKnown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
  });


// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });


/** Listen */
httpServer.listen(variableData.server.port, () =>{
    logging.info(`Server is running ${variableData.server.hostname}:${variableData.server.port}`),
    connectDB()
}
)