const config = require('../../config.json');
const fs = require('fs');
const QUERIES = require('./queries');

const knex = require('knex')({
  dialect: 'pg',
  connection: {
    database: config.database.dbname,
  },
});

const checkFileExists = filePath => new Promise((resolve, reject) => {
  fs.stat(filePath, (err ,res) => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});

const importLocalizationData = async (filePath) => {
  const localization = JSON.parse(fs.readFileSync(filePath).toString('utf-8'));
  for ([key, translations] of Object.entries(localization)) {
    await QUERIES.upsertTranslation(knex, {
      key,
      ...translations,
    });
  };
};

(async () => {
  const filePath = process.argv[2];
  try {
    await checkFileExists(filePath);
  } catch (e) {
    return console.error(`File does not exists ${filePath}`);
  }

  try {
    await importLocalizationData(filePath);
  } catch(e) {
    return console.error(`Unable to import localization file ${filePath}. Error: ${e}`);
  }
  console.log('Localization file was successfully imported');
})();
