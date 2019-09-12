class BasePlugin {
    constructor() {
        if (this.name == 'BasePlugin') {
            throw new Error("Cannot create instance of base plugin class!!");
        }
    }

    generateEmbed(data = {}) {
        let buildStatus = 'Build status unknown';
        let color = 0xFFFFFF;
        let description = data.description || `\`${data.commitId.substring(0, 7)}\` ${data.commitMessage} - ${data.commitAuthor}`;

        switch (data.status.toLowerCase()) {
            case 'success':
            case 'succeeded': {
                buildStatus = 'Build succeeded';
                color = 0x4CAF50;
                break;
            }
            case 'infrastructure_fail':
            case 'fail':
            case 'failed': {
                buildStatus = 'Build failed';
                color = 0xF44336;
                break;
            }
            case 'error':
            case 'errorred': {
                buildStatus = 'Build errorred';
                color = 0xF44336;
                break;
            }
            case 'canceled':
            case 'cancel': {
                buildStatus = 'Build cancelled';
                color = 0xFF5252;
                break;
            }
            case 'timedout':
            case 'timeout': {
                buildStatus = 'Build timed out';
                color = 0x00BCD4;
                break;
            }
            case 'pass':
            case 'passed': {
                buildStatus = 'Build passed';
                color = 0x4CAF50;
                break;
            }
            case 'finished':
            case 'finish':
            case 'done':
            default: {
                buildStatus = 'Build finished';
                color = 0x03A9F4;
            }
        }

        return {
            title: buildStatus,
            url: data.url,
            description,
            color,
            author: {
                name: data.authorName || `${data.repositoryOwner}/${data.repository}:${data.branch}`
            }
        };
    }

    verify(req, body) { // eslint-disable-line no-unused-vars
        return Promise.resolve();
    }

    execute(body) {
        return {
            service: 'Unnamed',
            logo: 'https://discordapp.com/assets/e05ead6e6ebc08df9291738d0aa6986d.png',
            embed: this.generateEmbed(body)
        };
    }
}

module.exports = BasePlugin;

