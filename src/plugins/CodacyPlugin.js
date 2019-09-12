const BasePlugin = require('../BasePlugin');

class Codacy extends BasePlugin {
    generateEmbed(body) {
        let color = 0xFFFFFF;
        let status = 'Unknown';

        if (body.commit.results.new_count > 0) {
            color = 0xF44336;
            status = 'New errors';
        } else {
            color = 0x4CAF50;
            status = 'No errors';
        }

        return {
            title: status,
            color,
            url: body.commit.data.urls.delta,
            description: `\`${body.commit.data.uuid.substring(0, 7)}\` Fixed: ${body.commit.results.fixed_count} New: ${body.commit.results.new_count}`
        };
    }

    execute(body) {
        return {
            service: 'Codacy',
            logo: 'https://p14.zdassets.com/hc/settings_assets/960438/200158055/j2MxqjmX2ar8LeC06jBR8g-S_B_Big.png',
            embed: this.generateEmbed(body)
        };
    }
}

module.exports = Codacy;
