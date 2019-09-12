const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');

const BasePlugin = require('./BasePlugin');

let {EventEmitter} = require('events');

try {
    global.Promise = require('bluebird');
} catch(e) { // eslint-disable no-empty
}

try {
    EventEmitter = require('eventemitter3');
} catch(e) { // eslint-disable no-empty
}

class CircleDisc extends EventEmitter {
    constructor(url, port) {
        super();

        if (!url) {
            throw new Error('URL is not specified!');
        }

        if (!port) {
            throw new Error('Port/Server is not specified!');
        }

        this.server = port instanceof http.Server ? port : http.createServer();
        this.port = port;
        this.plugins = {};
        const parts = url.split('/webhooks/')[1].split('?')[0].split('/');

        this.id = parts[0];
        this.token = parts[1];

        this.server.once('listening', () => this.emit('ready'));

        this.loadPlugins();
    }

    loadPlugins(dir = 'plugins') {
        const files = fs.readdirSync(path.join(__dirname, dir)).filter(f => f.endsWith('.js'));

        for (const file of files) {
            const plugin = new (require(path.join(__dirname, dir, file)))();

            if (!(plugin instanceof BasePlugin) || !plugin.hasOwnProperty('execute') || !plugin.name) {
                continue;
            }

            this.plugins[plugin.name.toLowerCase()] = plugin;
        }

        this.emit('pluginsLoaded', this.plugins);
    }

    startListening() {
        if (!this.server.listening) {
            this.server.listen(this.port);
        }

        this.server.on('request', (req, res) => this._onRequest(req, res));
    }

    shutdown(cb) {
        return this.server.close(cb || (() => {}));
    }

    _sendRequest(obj) {
        return new Promise((resolve, reject) => {
            if (!obj) {
                return reject('No data object given');
            }

            const data = {
                avatar_url: obj.logo,
                username: obj.service,
                embeds: [obj.embed],
                tts: false,
                content: null
            };

            const req = https.request({
                protocol: 'https:',
                hostname: 'discordapp.com',
                path: `/api/v6/webhooks/${this.id}/${this.token}?wait=true`,
                method: 'POST',
                headers: {
                    'User-Agent': `CircleDisc (https://github.com/ClarityCafe/CircleDisc, ${require('../package.json').version})`,
                    'Content-Type': 'application/json'
                }
            }, res => {
                res.setEncoding('utf8');
                res.on('data', chunk => {
                    this.emit('requestData', chunk);
                    resolve();
                });
            });

            req.on('error', e => {
                this.emit('error', e);
                reject(e.message);
            });

            req.end(JSON.stringify(data));
        });
    }

    _onRequest(req, res) {
        if (!req || !(req instanceof http.IncomingMessage)) {
            throw new Error('Request object is not an IncomingMessage');
        }

        if (!res || !(res instanceof http.ServerResponse)) {
            throw new Error('Response object is not a ServerResponse');
        }

        if (req.method !== 'POST') {
            res.writeHead(405);
            return res.end(
                JSON.stringify({
                    error: true,
                    message: 'Method is not POST'
                })
            );
        }

        const path = req.url.split('?')[0].split('/').slice(1);

        let body = [];

        req.on('error', e => this.emit('error', e));

        req
            .on('data', chunk => body.push(chunk))
            .once('end', () => {
                this.emit('request', body);

                switch (path[0]) {
                    case 'webhook': {
                        if (path.length < 2 || !path[1] || !this.plugins.hasOwnProperty(path[1])) {
                            res.writeHead(404);
                            return res.end(
                                JSON.stringify({
                                    error: true,
                                    message: 'Invalid service'
                                })
                            );
                        }

                        if (!req.headers.hasOwnProperty('content-type')) {
                            res.writeHead(400);
                            return res.end(
                                JSON.stringify({
                                    error: true,
                                    message: 'Content-Type header is not set'
                                })
                            );
                        }

                        const rawBody = Buffer.concat(body).toString();

                        if (req.headers['content-type'].startsWith('application/json')) {
                            body = JSON.parse(Buffer.concat(body).toString());
                        } else if (req.headers['content-type'].startsWith('application/x-www-form-urlencoded')) {
                            body = qs.parse(Buffer.concat(body).toString());
                        }

                        this.emit('build', path[1], body, rawBody);

                        this.plugins[path[1]]
                            .verify(req, rawBody)
                            .then(() => {
                                this._sendRequest(this.plugins[path[1]].execute(body))
                                    .then(() => {
                                        this.emit('requestComplete');

                                        res.writeHead(200);
                                        res.end(
                                            JSON.stringify({
                                                error: false,
                                                message: 'OK'
                                            })
                                        );
                                    })
                                    .catch(err => {
                                        this.emit('error', err);
        
                                        res.writeHead(200);
                                        res.end(
                                            JSON.stringify({
                                                error: true,
                                                message: err
                                            })
                                        );
                                    });
                            })
                            .catch(() => {
                                res.writeHead(401);
                                res.end(
                                    JSON.stringify({
                                        error: true,
                                        message: 'Unauthorized'
                                    })
                                );
                            });

                        break;
                    }

                    default: {
                        res.writeHead(404);
                        res.end(
                            JSON.stringify({
                                error: true,
                                message: `Invalid endpoint ${path[0]}`
                            })
                        );
                    }
                }
            });
    }
}

module.exports = CircleDisc;

