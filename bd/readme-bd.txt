CREATE DATABASE db_name ENCODING 'UTF-8' LC_COLLATE 'en-EN-x-icu' LC_CTYPE 'ro_RO' TEMPLATE template0;

Open query window: Alt+Shift+Q
Run: F5

After creating the table, create a new user:

CREATE USER username WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE db_name TO username ;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO username;