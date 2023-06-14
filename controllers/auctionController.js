import pool from "../config/database.js";
import {v4 as uuidv4} from 'uuid';
import xss from "xss";

export const auction = (req, res) => {
    let sql = ` SELECT *
                FROM items
                         INNER JOIN images ON image_id = images.id
                         INNER JOIN category_items ON category_id = category_items.id
                         INNER JOIN users ON user_id = users.id
    `;

    pool.query(sql, function (error, items) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            res.render('layout', {template: 'auction', items: items});
        }
    });
}

export const searchItems = (req, res) => {
    const search = req.body.search;
    let sql = ` SELECT *
                FROM items
                         INNER JOIN images ON image_id = images.id
                         INNER JOIN category_items ON category_id = category_items.id
                         INNER JOIN users ON user_id = users.id
                WHERE category_items.name LIKE '%${search}%' `;
    pool.query(sql, function (error, items) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            res.render('layout', {template: 'auction', items: items});
        }
    });
}

export const addItems = (req, res) => {
    let id = req.session.userId;

    let sql = "SELECT * FROM images";
    pool.query(sql, function (error, images) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            let query = "SELECT * FROM users WHERE id = ?";
            pool.query(query, id, function (error, user) {
                if (error) {
                    console.error(error)
                    res.status(500).send('erreur de bdd')
                } else {
                    let sql2 = "SELECT * FROM category_items";
                    pool.query(sql2, function (error, category) {
                        if (error) {
                            console.error(error)
                            res.status(500).send('erreur de bdd')
                        } else {
                            res.render('layout', {
                                template: 'addItems',
                                images: images,
                                user: user[0],
                                category: category
                            });
                        }
                    });
                }
            });
        }
    });
}

export const addItemsSubmit = (req, res) => {
    let id = req.session.userId;

    const {title, content, price, category, image} = req.body;

    const safeTitle = xss(title);
    const safeContent = xss(content);
    const safePrice = xss(price);

    if (safeTitle.length < 3 || safeTitle.length > 50) {
        res.status(400).send('le titre doit contenir entre 3 et 50 caractères')

    } else if (safeContent.length < 3 || safeContent.length > 255) {
        res.status(400).send('la description doit contenir entre 3 et 255 caractères')

    } else if (safePrice.length < 1 || safePrice.length > 10) {
        res.status(400).send('le prix ne doit pas dépasser 10 chiffres')

    } else if (category === undefined) {
        res.status(400).send('veuillez choisir une catégorie')

    } else if (image === undefined) {
        res.status(400).send('veuillez choisir une image')

    } else {
        let newItems = {
            id: uuidv4(),
            title: safeTitle,
            content: safeContent,
            price: safePrice,
            category_id: category,
            image_id: image,
            user_id: id
        }

        let sql = "INSERT INTO items SET ? ";
        pool.query(sql, [newItems], function (error, result) {
            if (error) {
                console.error(error)
                res.status(500).send('erreur de bdd')
            } else {
                res.redirect('/profile/' + id)
            }
        });
    }
}
