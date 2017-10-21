const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const bunyanMiddleware = require('bunyan-middleware');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const router = require('./router');

//DB Setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/auth', { useMongoClient: true });

// App Setup
app.use(cors());

// Logging

const logger = bunyan.createLogger({ name: 'My App' });

app.use(
    bunyanMiddleware({
        headerName: 'X-Request-Id',
        propertyName: 'reqId',
        logName: 'req_id',
        obscureHeaders: ['Authorization'],
        logger: logger
    })
);

app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
logger.info({ port: port }, 'Server initiated!');
