const config = require('../../config.json');

const express = require('express');
const bodyParser = require('body-parser')
const knex = require('knex');

const QUERIES = require('./queries');

const bootstrapDeps = (config) => ({
  knex: knex({
    dialect: 'pg',
    connection: {
      database: config.database.dbname,
    },
  }),
});

const attachRoutes = (app, { knex }) => {
  app.get(
    '/translations',
    async (req, res) => res.json(await QUERIES.getAllTranslations(knex))
  );
  app.get(
    '/translations/:key/history',
    async (req, res) => res.json(await QUERIES.getKeyHistory(knex, req.params.key))
  );
  app.patch(
    '/translations',
    async (req, res) => {
      try {
        return res.json(await QUERIES.upsertTranslation(true, knex, req.body))
      } catch (err) {
        return res.status(400).send(err.message);
      }
    }
  );
  app.post(
    '/translations',
    async (req, res) => {
      try {
        return res.json(await QUERIES.upsertTranslation(false, knex, req.body))
      } catch (err) {
        return res.status(400).send(err.message);
      }
    }
  );
  app.post(
    '/translations/delete',
    async (req, res) => res.json(await QUERIES.deleteTranslation(knex, req.body))
  );
};


(async () => {
  const app = express();
  app.use(bodyParser.json());
  const dependencies = bootstrapDeps(config);

  attachRoutes(app, dependencies);

  app.listen(config.backendPort);
})();
