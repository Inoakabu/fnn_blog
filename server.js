const http = require('http');
const app = require('./app');

const config = require('./api/config/config.json')
const logger = require("debug")("dev:server");


const port = process.env.PORT || config.http.port;

const server = http.createServer(app);
server.listen(port);

logger(`[*] Express runs on localhost:${port}`)