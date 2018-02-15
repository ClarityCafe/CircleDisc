const BasePlugin = require('../BasePlugin');

class Circle extends BasePlugin {
    static execute(body) {
        return {
            service: 'CircleCI',
            logo: 'https://d3r49iyjzglexf.cloudfront.net/logo-circleci-blog-e378a4db441e1ec3e15d50e9a356232eea65929d97d639b02fdefb4e45ea6fa4.png',
            embed: BasePlugin.generateEmbed({
                commitId: body.payload.vcs_revision,
                commitAuthor: body.payload.committer_name,
                commitMessage: body.payload.subject,
                status: body.payload.status,
                url: body.payload.build_url,
                repository: body.payload.reponame,
                repositoryOwner: body.payload.username,
                branch: body.payload.branch
            })
        };
    }
}

module.exports = Circle;

