const http = require('http');
const https = require('https');
let { EventEmitter } = require('events');

try {
    global.Promise = require('bluebird');
} catch (e) {
    // Bluebird not found, ignoring
}

try {
    EventEmitter = require('eventemitter3');
} catch (e) {
    // EventEmitter3 not found, ignoring
}

/**
 * Main class.
 * 
 * @class CircleDisc
 * @extends {EventEmitter}
 */
class CircleDisc extends EventEmitter {

    /**
     * Creates an instance of CircleDisc.
     * @param {any} id 
     * @param {any} token 
     * @param {any} port 
     * @memberof CircleDisc
     */
    constructor(id, token, port) {
        super();

        if (!port && (token instanceof http.Server || typeof token === 'number')) {
            const regex = /discordapp\.com\/api\/webhooks\/(\d+)\/([^/]+)/i;
            const url = id;

            port = token;
            id = url.match(regex)[1];
            token = url.match(regex)[2];
        }

        this.id = id;
        this.token = token;
        this.port = port || 8080;

        if (port instanceof http.Server) {
            this.server = port;
            this.server.on('request', (req, res) => this._onRequest(req, res));
        } else {
            this.server = http.createServer((req, res) => this._onRequest(req, res));
            this.server.listen(port, '0.0.0.0');
        }

        this.server.once('listening', () => this.emit('listening', this.server));
    }

    _onRequest(req, res) {
        if (req.method !== 'POST') {
            // REEEEEEE
            res.write('<img src="https://cdn.frankerfacez.com/emoticon/61193/4">');
            res.end();
            return;
        }

        let body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {

            body = JSON.parse(Buffer.concat(body).toString());

            res.write('OK');
            res.end();

            if (!body) {
                return;
            }

            switch (req.url) {
                case '/hooks/circleci': {
                    this.emit('buildComplete', body, 'CircleCI');
                    this.execHook(this._getCircleEmbed(body.payload), this._getAvatar('circleci'), this._getUsername('circleci'));
                    break;
                }
                case '/hooks/appveyor': {
                    this.emit('buildComplete', body, 'AppVeyor');
                    this.execHook(this._getAppVeyorEmbed(body), this._getAvatar('appveyor'), this._getUsername('appveyor'));
                    break;
                }
                case '/hooks/travisci': {
                    this.emit('buildComplete', body, 'TravisCI');
                    this.execHook(this._getTravisEmbed(body), this._getAvatar('travisci'), this._getUsername('travisci'));
                    break;
                }
                default: {
                    res.write('<img src=\'https://cdn.frankerfacez.com/emoticon/61193/4\'>');
                    res.end();
                }
            }
        });
    }

    _getAppVeyorEmbed(body) {
        const desc = `\`${body.eventData.commitId.substring(0, 7)}\` ${body.eventData.commitMessage} - ${body.eventData.commitAuthor}`;

        console.log(body.eventName);

        switch (true) {
            case body.eventData.passed: {
                return [{
                    title: 'Build Success',
                    url: body.eventData.buildUrl,
                    description: desc,
                    color: 0x7fff3f,
                    author: {
                        name: `${body.eventData.repositoryName}:${body.eventData.branch}`
                    }
                }];
            }
            case body.eventData.failed: {
                return [{
                    title: 'Build Failed',
                    url: body.eventData.buildUrl,
                    description: desc,
                    color: 0xff3f3f,
                    author: {
                        name: `${body.eventData.repositoryName}:${body.eventData.branch}`
                    }
                }];
            }
            default: {
                return [{
                    title: 'Unknown result',
                    url: body.eventData.buildUrl,
                    description: desc,
                    color: 0xfffff,
                    author: {
                        name: `${body.eventData.repositoryName}:${body.eventData.branch}`
                    }
                }];
            }
        }
    }

    _getCircleEmbed(payload) {

        const desc = `\`${payload.vcs_revision.substring(0, 7)}\` ${payload.subject} - ${payload.committer_name}`;

        switch (payload.outcome) {
            case 'success': {
                return [{
                    title: 'Build Success',
                    url: payload.build_url,
                    description: desc,
                    color: 0x7fff3f,
                    author: {
                        name: `${payload.username}/${payload.reponame}:${payload.branch}`,
                        url: payload.vcs_url
                    }
                }];
            }
            case 'failed': {
                return [{
                    title: 'Build Failed',
                    url: payload.build_url,
                    description: desc,
                    color: 0xff3f3f,
                    author: {
                        name: `${payload.username}/${payload.reponame}:${payload.branch}`,
                        url: payload.vcs_url
                    }
                }];
            }

            case 'infrastructure_fail': {
                return [{
                    title: 'Build Infrastructure Failed',
                    url: payload.build_url,
                    description: desc,
                    color: 0xff3f3f,
                    author: {
                        name: `${payload.username}/${payload.reponame}:${payload.branch}`,
                        url: payload.vcs_url
                    }
                }];
            }

            case 'canceled': {
                return [{
                    title: 'Build Canceled',
                    url: payload.build_url,
                    description: desc,
                    color: 0xff3f3f,
                    author: {
                        name: `${payload.username}/${payload.reponame}:${payload.branch}`,
                        url: payload.vcs_url
                    }
                }];
            }

            case 'timedout': {
                return [{
                    title: 'Build Timed out',
                    url: payload.build_url,
                    description: desc,
                    author: {
                        name: `${payload.username}/${payload.reponame}:${payload.branch}`,
                        url: payload.vcs_url
                    }
                }];
            }

            default: {
                return [{
                    title: 'Unknown result',
                    url: payload.build_url,
                    description: desc,
                    color: 0xfffff,
                    author: {
                        name: `${payload.username}/${payload.reponame}:${payload.branch}`,
                        url: payload.vcs_url
                    }
                }];
            }
        }
    }

    _getTravisEmbed(body) {
        const desc = `\`${body.commit.substring(0, 7)}\` ${body.message} - ${body.author_name}`;

        switch (body.state) {
            case 'passed': {
                return [{
                    title: 'Build Success',
                    url: body.build_url,
                    description: desc,
                    color: 0x7fff3f,
                    author: {
                        name: `${body.repository.owner_name}/${body.repository.name}:${body.branch}`,
                        url: body.repository.url
                    }
                }];
            }
            case 'failed': {
                return [{
                    title: 'Build Failed',
                    url: body.build_url,
                    description: desc,
                    color: 0xff3f3f,
                    author: {
                        name: `${body.repository.owner_name}/${body.repository.name}:${body.branch}`,
                        url: body.repository.url
                    }
                }];
            }
            case 'errored': {
                return [{
                    title: 'Build Errored',
                    url: body.build_url,
                    description: desc,
                    color: 0xff3f3f,
                    author: {
                        name: `${body.repository.owner_name}/${body.repository.name}:${body.branch}`,
                        url: body.repository.url
                    }
                }];
            }
            default: {
                return [{
                    title: `Unknown Result: ${body.status_message} (state = ${body.state})`,
                    url: body.build_url,
                    description: desc,
                    color: 0xfffff,
                    author: {
                        name: `${body.repository.owner_name}/${body.repository.name}:${body.branch}`,
                        url: body.repository.url
                    }
                }];
            }
        }
    }

    _getAvatar(type) {
        switch (type.toLowerCase()) {
            case 'appveyor': {
                return 'https://www.appveyor.com/assets/img/appveyor-logo-256.png';
            }
            case 'circleci': {
                return 'https://d3r49iyjzglexf.cloudfront.net/components/default/illu_hero-home-54f5aa459a11db1e8e53633518212a559f743f442df9fdc2c4cecb6854635f90.png';
            }
            case 'travisci': {
                return 'https://travis-ci.org/images/logos/TravisCI-Mascot-1.png';
            }
            default: {
                return 'https://cdn.frankerfacez.com/emoticon/61193/4';
            }
        }
    }

    _getUsername(type) {
        switch (type.toLowerCase()) {
            case 'appveyor': {
                return 'AppVeyor';
            }
            case 'circleci': {
                return 'CircleCI';
            }
            case 'travisci': {
                return 'Travis CI';
            }
            default: {
                return 'Unknown CI';
            }
        }
    }

    /**
     * Execute the webhook
     * 
     * @param {embed} embed 
     * @param {string} avatar 
     * @param {string} username 
     * @returns 
     * @memberof CircleDisc
     */
    execHook(embed, avatar, username) {
        if (!embed) {
            return;
        }

        const data = {
            avatar_url: avatar,
            username: username,
            embeds: embed,
            tts: false,
            content: null
        };

        const req = https.request({
            protocol: 'https:',
            hostname: 'discordapp.com',
            path: `/api/v6/webhooks/${this.id}/${this.token}?wait=true`,
            method: 'POST',
            headers: {
                'User-Agent': `CircleDisc (https://github.com/ClarityMoe/CircleDisc, ${require('../package.json').version})`,
                'Content-Type': 'application/json'
            }
        }, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                this.emit('webhookSent', chunk);
            });
        });

        req.on('error', (e) => {
            console.error('Got an error while trying to execute webhook:', e.message);
        });

        req.write(JSON.stringify(data));
        req.end();
    }

}

module.exports = CircleDisc;