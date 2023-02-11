CREATE TYPE roles AS ENUM('admin', 'moderator', 'common');

CREATE TABLE IF NOT EXISTS users (
   user_id serial PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   last_name VARCHAR(100) NOT NULL,
   first_name VARCHAR(100) NOT NULL,
   passw VARCHAR(500) NOT NULL,
   rol roles NOT NULL DEFAULT 'common',
   email VARCHAR(100) NOT NULL,
   chat_color VARCHAR(50) NOT NULL DEFAULT 'black',
   add_date TIMESTAMP DEFAULT current_timestamp,
   code character varying(200),
   confirmed_mail boolean DEFAULT false,
   image VARCHAR(300),
   phone VARCHAR(20),
   birth_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS acces (
   id serial PRIMARY KEY,
   ip VARCHAR(100) NOT NULL,
   user_id INT NULL REFERENCES users(user_id),
   page VARCHAR(500) NOT NULL,
   acces_date TIMESTAMP DEFAULT current_timestamp
);

