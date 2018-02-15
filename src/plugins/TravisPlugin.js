const BasePlugin = require('../BasePlugin');

class Travis extends BasePlugin {
    static execute(body) {
        return {
            service: 'Travis CI',
            logo: 'https://travis-ci.org/images/logos/TravisCI-Mascot-1.png',
            embed: BasePlugin.generateEmbed({
                commitId: body.payload.commit,
                commitMessage: body.payload.message,
                commitAuthor: body.payload.author_name,
                status: body.payload.state,
                url: body.payload.build_url,
                repository: body.payload.repository.name,
                repositoryOwner: body.payload.repository.owner_name,
                branch: body.payload.branch
            })
        };
    }
}

module.exports = Travis;

