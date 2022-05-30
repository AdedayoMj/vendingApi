"use strict";
const allowedOrigins = [
    'http://localhost:56773',
    'http://localhost:3770'
];
const corsOptions = {
    origin: (origin, cb) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            cb(null, true);
        }
        else {
            cb(new Error('Not allowed by CORS'), false);
        }
    },
    allowedHeaders: (['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']),
    credentials: true,
    preflightContinue: false,
    methods: (['GET', 'PUT', 'POST', 'PATCH', 'DELETE']),
    optionsSuccessStatus: 200
};
module.exports = corsOptions;
//# sourceMappingURL=corsOptions.js.map