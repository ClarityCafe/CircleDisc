const BasePlugin = require('../BasePlugin');

class AppVeyor extends BasePlugin {
    static execute(body) {
        return {
            logo: 'https://www.appveyor.com/assets/img/appveyor-logo-256.png',
            service: 'AppVeyor',
            embed: BasePlugin.generateEmbed({
                commitAuthor: body.eventData.commitAuthor,
                commitId: body.eventData.commitId,
                commitMessage: body.eventData.commitMessage,
                status: body.eventData.status,
                url: body.eventData.buildUrl,
                repository: body.eventData.repositoryName.split('/')[0],
                repositoryOwner: body.eventData.repositoryName.split('/')[1],
                branch: body.eventData.branch
            })
        };
    }
}

module.exports = AppVeyor;

