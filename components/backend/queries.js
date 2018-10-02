module.exports = {
  getAllTranslations: (knex) => knex('translations'),

  upsertTranslation: (knex, data, userId = null) => {
    return knex.transaction(async (trx) => {
      const existing = await trx('translations')
        .first()
        .where({ keyname: data.key })
        .forUpdate();

      const res = await (() => {
        if (existing) {
          return trx('translations')
            .update({
              ru_translation: data.ru,
              en_translation: data.en,
            })
            .where({ keyname: data.key })
            .returning('*');
        }
        return trx('translations')
          .insert({
            keyname: data.key,
            ru_translation: data.ru,
            en_translation: data.en,
          })
          .returning('*');
      })();


      await trx('changes_history')
        .insert({
          user_id: userId,
          translation_key: data.key,
          data: {
            ru_translation: data.ru,
            en_translation: data.en,
          },
        });
    });
  },

  getKeyHistory: (knex, keyname) => knex('changes_history')
    .select([ 'data', 'ts', 'login' ])
    .leftJoin('users', 'users.id', 'changes_history.user_id')
    .where({ translation_key: keyname }),
};
