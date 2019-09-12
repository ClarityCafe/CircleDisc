const BasePlugin = require('../BasePlugin');
const https = require('https');
const crypto = require('crypto');

class Travis extends BasePlugin {
    verify(req, body) {
        return new Promise((resolve, reject) => {
            if (!req.headers.hasOwnProperty('signature')) {
                return reject();
            }

            const buf = Buffer.from(req.headers.signature, 'base64');
            const sig = buf.toString();

            https.request({
                protocol: 'https:',
                hostname: 'api.travis-ci.org',
                path: `/config`,
                method: 'GET',
                headers: {
                    'User-Agent': `CircleDisc (https://github.com/ClarityMoe/CircleDisc, ${require('../../package.json').version})`
                }
            }, res => {
                res.setEncoding('utf8');
                let data = [];

                res
                    .on('data', chunk => { data = chunk; })
                    .once('end', () => {
                        data = JSON.parse(data);
                        const pubkey = data.config.notifications.webhook.public_key;
                        const verifier = crypto.createVerify('sha1');

                        verifier.update(body);
                        verifier.verify(pubkey, sig) ? resolve() : reject();
                    });
            }).end();
        });
    }

    execute(body) {
        const payload = JSON.parse(body.payload);

        return {
            service: 'Travis CI',
            logo: 'https://travis-ci.org/images/logos/TravisCI-Mascot-1.png',
            embed: this.generateEmbed({
                commitId: payload.commit,
                commitMessage: payload.message,
                commitAuthor: payload.author_name,
                status: payload.state,
                url: payload.build_url,
                repository: payload.repository.name,
                repositoryOwner: payload.repository.owner_name,
                branch: payload.branch
            })
        };
    }
}

module.exports = Travis;

