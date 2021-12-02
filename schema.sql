CREATE TABLE categories (
  id INTEGER PRIMARY KEY  GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar VARCHAR(50) NOT NULL
);

CREATE TABLE offers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description text NOT NULL,
  type VARCHAR(5) NOT NULL,
  sum INTEGER NOT NULL,
  picture VARCHAR(50),
  user_id INTEGER NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  offer_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (offer_id) REFERENCES offers(id)
);

CREATE TABLE offers_categories (
  offer_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (offer_id, category_id),
  FOREIGN KEY (offer_id) REFERENCES offers(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX ON offers(title);
