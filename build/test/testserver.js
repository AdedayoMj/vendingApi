"use strict";
const express = require('express');
const userRoutes = require('../routes/user');
const productRoutes = require('../routes/product');
const server = express();
server.use(express.json());
server.use('/api/user', userRoutes);
server.use('/api/product', productRoutes);
module.exports = server;
//# sourceMappingURL=testserver.js.map