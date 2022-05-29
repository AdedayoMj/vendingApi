const express = require('express');
const userRoutes = require('../routes/user');


const server = express();
server.use(express.json());

module.exports = server;