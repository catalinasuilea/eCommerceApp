CREATE TABLE IF NOT EXISTS users (
  user_id serial NOT NULL,
  firstname varchar(255) NOT NULL,
  lastname varchar(255) NOT NULL,
  email varchar(50) NOT NULL,
  phone varchar(20) NOT NULL,
  user_key varchar(64) DEFAULT NULL,
  created_date timestamp DEFAULT NULL,
  modified_date timestamp DEFAULT NULL,
  created_by int DEFAULT NULL,
  modified_by int DEFAULT NULL,
  password varchar(200) DEFAULT NULL,
  PRIMARY KEY (user_id)
);
