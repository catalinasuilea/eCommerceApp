DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS address CASCADE;
DROP TABLE IF EXISTS customer CASCADE;

CREATE TABLE IF NOT EXISTS customer (
    id serial NOT NULL PRIMARY KEY,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS address (
    id serial NOT NULL PRIMARY KEY,
    city varchar(255) NOT NULL,
    country varchar(255) NOT NULL,
    state varchar(50) NOT NULL,
    street varchar(50) NOT NULL,
    zip_code varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
   id SERIAL NOT NULL PRIMARY KEY,
   order_tracking_number VARCHAR(255),
   total_price DECIMAL NOT NULL,
   total_quantity INT NOT NULL,
   customer_id INT NOT NULL,
   billing_address_id INT NOT NULL,
   shipping_address_id INT NOT NULL,
   status varchar(128),
   date_created timestamp,
   last_updated timestamp,

   FOREIGN KEY (customer_id) REFERENCES customer(id),
   FOREIGN KEY (billing_address_id) REFERENCES address(id),
   FOREIGN KEY (shipping_address_id) REFERENCES address(id)
);

CREATE TABLE IF NOT EXISTS order_item (
   id SERIAL NOT NULL PRIMARY KEY,
   image_url VARCHAR(255),
   quantity INT NOT NULL,
   unit_price DECIMAL NOT NULL,
   order_id INT NOT NULL,
   product_id INT NOT NULL,

   FOREIGN KEY (order_id) REFERENCES orders(id)
);