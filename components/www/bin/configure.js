const path = require('path');
const fs = require('fs').promises;

const url = process.env.API_URL || 'http://localhost/';

const configure = async () => {
    try {
        const data = await fs.readFile(
            path.resolve(__dirname, '../src/services/api/config.js.dist'),
            'utf8'
        );
        const configData = data.replace('http://example.com/api', url);
        await fs.writeFile(
            path.resolve(__dirname, '../src/services/api/config.js'),
            configData,
            'utf8'
        );
        console.info(`Configs created, url: ${url}`);
    } catch (err) {
        console.error(err);
    }
};

configure();
