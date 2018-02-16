const BasePlugin = require('../BasePlugin');

class Travis extends BasePlugin {
    static execute(body) {
        const payload = JSON.parse(body.payload);

        return {
            service: 'Travis CI',
            logo: 'https://travis-ci.org/images/logos/TravisCI-Mascot-1.png',
            embed: BasePlugin.generateEmbed({
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

