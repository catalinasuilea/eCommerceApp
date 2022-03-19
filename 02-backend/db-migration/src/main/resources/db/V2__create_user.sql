DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS product_category CASCADE;
DROP TABLE IF EXISTS product CASCADE;

CREATE TABLE IF NOT EXISTS users (
  user_id serial NOT NULL PRIMARY KEY,
  firstname varchar(255) NOT NULL,
  lastname varchar(255) NOT NULL,
  email varchar(50) NOT NULL,
  phone varchar(20) NOT NULL,
  created_date timestamp,
  modified_date timestamp,
  password varchar(200)
);

CREATE TABLE IF NOT EXISTS product_category (
   id SERIAL NOT NULL PRIMARY KEY,
   category_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS product (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(255),
  description VARCHAR(255),
  unit_price DECIMAL(13,2),
  image_url VARCHAR(255),
  active BOOLEAN,
  units_in_stock INT,
  created_date timestamp,
  last_updated_date timestamp,
  category_id INT NOT NULL,

  FOREIGN KEY (category_id) REFERENCES product_category(id)
);