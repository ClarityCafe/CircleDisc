const BasePlugin = require('../BasePlugin');

class Docker extends BasePlugin {
    execute(body) {
        return {
            logo: 'https://secure.gravatar.com/avatar/7510e100f7ebeca4a0b8c3c617349295.jpg?s=1024',
            service: 'Docker',
            embed: this.generateEmbed({
                description: body.repository.full_description,
                repository: body.repository.name,
                repositoryOwner: body.repository.owner,
                status: 'finished',
                url: body.repository.repo_url,
                branch: body.push_data.tag
            })
        };
    }
}

module.exports = Docker

