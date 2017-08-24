const http = require("http");
const https = require("https");
let { EventEmitter } = require("events");

try {
    global.Promise = require("bluebird");
} catch (e) {
    // Bluebird not found, ignoring
}

try {
    EventEmitter = require("eventemitter3");
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
        this.id = id;
        this.token = token;
        port = port || 8080;
        if (port instanceof http.Server) {
            this.server = port;
            this.server.on("request", (req, res) => this._onRequest(req, res));
        } else {
            this.server = http.createServer((req, res) => this._onRequest(req, res));
            this.server.listen(port, "0.0.0.0");
        }

        this.server.once("listening", () => this.emit("listening", this.server));
    }

    _onRequest(req, res) {
        if (req.method !== "POST" && req.url !== "/hooks/circleci") {
            // REEEEEE
            res.write("<img src='https://cdn.frankerfacez.com/emoticon/61193/4'>");
            res.end();
            return;
        }

        let body = [];

        req.on("data", (chunk) => {
            body.push(chunk);
        }).on("end", () => {

            body = Buffer.concat(body).toString();

            res.write("OK")
            res.end();

            if (!body || !body.hasOwnProperty("payload")) {
                return;
            }

            this.emit("buildComplete", body.payload);
            this._execHook(body.payload);
        });
    }

    _getResultEmbed(payload) {

        const desc = `\`${payload.vcs_revision.substring(0, 7)}\` ${payload.subject} - ${payload.committer_name}`

        switch (payload.outcome) {
            case "success": {
                return [{
                    title: "Build Success",
                    url: payload.build_url,
                    description: desc,
                    color: 0x7fff3f,
                    author: {
                        name: `${payload.username}/${payload.reponame}`
                    }
                }]
            }
            case "failed": {
                return [{
                    title: "Build Failed",
                    url: payload.build_url,
                    description: desc,
                    color: 0xff3f3f,
                    author: {
                        name: `${payload.username}/${payload.reponame}`
                    }
                }]
            }

            default: {
                return [{
                    title: "Unknown result",
                    url: payload.build_url,
                    description: desc,
                    color: 0xfffff,
                    author: {
                        name: `${payload.username}/${payload.reponame}`
                    }
                }]
            }
        }
    }

    _execHook(payload) {
        if (!payload) {
            return;
        }

        const data = {
            avatar_url: "https://d3r49iyjzglexf.cloudfront.net/components/default/illu_hero-home-54f5aa459a11db1e8e53633518212a559f743f442df9fdc2c4cecb6854635f90.png",
            username: "CircleCI",
            embeds: this._getResultEmbed(payload),
            tts: false,
            content: null
        }

        const req = https.request({
            protocol: "https:",
            hostname: "discordapp.com",
            path: `/api/v6/webhooks/${this.id}/${this.token}?wait=true`,
            method: "POST",
            headers: {
                "User-Agent": "CircleDisc (https://github.com/ClaraIO/CircleDisc, v0.0.1)",
                "Content-Type": "application/json"
            }
        }, (res) => {
            res.setEncoding("utf8");
            res.on("data", (chunk) => {
                this.emit("webhookSent", chunk);
            });
        });

        req.on("error", (e) => {
            console.error("Got an error while trying to execute webhook:", e.message);
        });

        req.write(JSON.stringify(data));
        req.end();
    }

}

module.exports = CircleDisc;