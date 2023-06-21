CREATE TABLE category_items
(
    id   CHAR(36)     NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE category_articles
(
    id   CHAR(36)     NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE images
(
    id               CHAR(36)     NOT NULL PRIMARY KEY,
    url              VARCHAR(255) NOT NULL,
    categoryitems_id CHAR(36)     NOT NULL,
    FOREIGN KEY (categoryitems_id) REFERENCES category_items (id)
);

CREATE TABLE users
(
    id       CHAR(36)     NOT NULL PRIMARY KEY,
    pseudo   VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role     VARCHAR(255) NOT NULL
);

CREATE TABLE items
(
    id          CHAR(36)       NOT NULL PRIMARY KEY,
    title       VARCHAR(255)   NOT NULL,
    content     TEXT           NOT NULL,
    category_id CHAR(36)       NOT NULL,
    user_id     CHAR(36)       NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,
    image_id    CHAR(36)       NOT NULL,
    FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category_items (id)
);

CREATE TABLE articles
(
    id          CHAR(36)     NOT NULL PRIMARY KEY,
    date        DATETIME     NOT NULL DEFAULT NOW(),
    title       VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL,
    category_id CHAR(36)     NOT NULL,
    user_id     CHAR(36)     NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category_articles (id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE comments
(
    id         CHAR(36)     NOT NULL PRIMARY KEY,
    date       DATETIME     NOT NULL DEFAULT NOW(),
    pseudo     VARCHAR(255) NOT NULL,
    comment    TEXT         NOT NULL,
    article_id CHAR(36)     NOT NULL,
    user_id    CHAR(36)     NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
);