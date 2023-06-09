CREATE TABLE category_items (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE category_articles (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    pseudo VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE items (
    id CHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id CHAR(36) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category_items(id)
);

CREATE TABLE articles (
    id CHAR(36) NOT NULL PRIMARY KEY,
    date DATETIME NOT NULL DEFAULT NOW(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id CHAR(36) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category_articles(id)
);

CREATE TABLE comments (
    id CHAR(36) NOT NULL PRIMARY KEY,
    date DATETIME NOT NULL DEFAULT NOW(),
    pseudo VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    article_id CHAR(36) NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id)
);