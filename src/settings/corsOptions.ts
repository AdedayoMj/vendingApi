const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3770'
];

const corsOptions = {
    origin: (origin: string, cb: (arg0: Error | null, arg1: boolean | undefined) => void) => {
        
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            cb(null, true)
        } else {
            cb(new Error('Not allowed by CORS'), false);
        }
    },
    allowedHeaders:(['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']),
    credentials: true,
    preflightContinue:false,
    methods: (['GET', 'PUT', 'POST', 'PATCH', 'DELETE' ]),
    optionsSuccessStatus: 200
}

module.exports = corsOptions;