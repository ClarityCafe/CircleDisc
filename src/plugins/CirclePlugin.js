const BasePlugin = require('../BasePlugin');

class Circle extends BasePlugin {
    static execute(body) {
        return {
            service: 'CircleCI',
            logo: 'https://d3r49iyjzglexf.cloudfront.net/logo-circleci-blog-e378a4db441e1ec3e15d50e9a356232eea65929d97d639b02fdefb4e45ea6fa4.png',
            embed: BasePlugin.generateEmbed({
                commitId: body.vcs_revision,
                commitAuthor: body.committer_name,
                commitMessage: body.subject,
                status: body.status,
                url: body.build_url,
                repository: body.reponame,
                repositoryOwner: body.username,
                branch: body.branch
            })
        };
    }
}

module.exports = Circle;

