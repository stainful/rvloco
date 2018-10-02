CREATE TABLE translations (
  keyname text PRIMARY KEY,
  ru_translation text,
  en_translation text
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  login TEXT unique NOT NULL,
  password text NOT NULL,
  active boolean DEFAULT false
);

CREATE TABLE changes_history (
  id SERIAL,
  translation_key text NOT NULL REFERENCES translations(keyname) ON DELETE CASCADE,
  data jsonb NOT NULL,
  user_id int REFERENCES users(id) ON DELETE RESTRICT,
  ts TIMESTAMP DEFAULT now()
)
