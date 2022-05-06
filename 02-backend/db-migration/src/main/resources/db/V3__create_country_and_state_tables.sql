DROP TABLE IF EXISTS country CASCADE;
DROP TABLE IF EXISTS state CASCADE;

CREATE TABLE IF NOT EXISTS country (
   id SERIAL NOT NULL PRIMARY KEY,
   code VARCHAR,
   name VARCHAR
);

CREATE TABLE IF NOT EXISTS state (
   id SERIAL NOT NULL PRIMARY KEY,
   name VARCHAR,
   country_id INT NOT NULL,

   FOREIGN KEY (country_id) REFERENCES country(id)
);