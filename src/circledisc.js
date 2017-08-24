const http = require("http");
const url = require("url");
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
 * Creates a new CircleCI webhook instance
 */
class CircleDisc extends EventEmitter {

    constructor (id, token, port) {
        super();
        this.id = id;
        this.token = token;
        if (port instanceof http.Server) {
            this.server = port || 8080;
        } else {
            this.server = http.createServer((req, res) => this._onRequest(req, res));
            this.server.listen(port);
        }

        this.server.once("listening", () => this.emit("listening", this.server));
    }

    _onRequest (req, res) {
        if (req.method !== "POST" && utl.parse(req.url).pathname !== "/hooks/circleci") {
            return;
        }

        let body = "";

        req.on("data", function (chunk) {
            console.log(chunk);
            body += chunk;
        })

        req.on("end", function () {

            try {
                body = JSON.parse(body);
            } catch (e) {
                return;
            }

            res.end();
        });

        if (!body.hasOwnProperty("payload")) {
            return;
        }

        console.log(body);

        this._execHook(body.payload);
    }
    /**
     * gets the result of the payload
     * @param {Object} payload
     * @returns {Object} the payload to be sent to Discord 
     */
    _getResultEmbed (payload) {

        const desc = `\`${payload.vcs_revision.susbtring(0, 7)}\` ${payload.subject} - ${payload.committer_name}`

        switch (payload.outcome) {
            case "success": {
                return {
                    title: "Build Success",
                    url: payload.build_url,
                    description: desc,
                    color: 0x7fff3f,
                    author: {
                        name: `${payload.username}/${payload.reponame}`
                    }
                }
            }
            case "failed": {
                return {
                    title: "Build Failed",
                    url: payload.build_url,
                    description: desc,
                    color: 0xff3f3f,
                    author: {
                        name: `${payload.username}/${payload.reponame}`
                    }
                }
            }
        }
    }

    /**
     * Execs a new Payload to Discord
     * @param {Object} payload 
     */
    _execHook (payload) {
        if (!payload) {
            return;
        }

        const data = {
            avatar_url: "https://d3r49iyjzglexf.cloudfront.net/components/default/illu_hero-home-54f5aa459a11db1e8e53633518212a559f743f442df9fdc2c4cecb6854635f90.png",
            username: "CircleCI",
            embeds: [this._getResultEmbed(payload)]
        }

        const req = http.request({
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
                console.log(chunk);
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