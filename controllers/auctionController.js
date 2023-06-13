import pool from "../config/database.js";
import {v4 as uuidv4} from 'uuid';
import xss from "xss";

export const auction = (req, res) => {
    let sql = " SELECT * FROM items INNER JOIN images ON image_id = images.id";
    pool.query(sql, function (error, result) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            res.render('layout', {template: 'auction', items: result});
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
    let newItems = {
        id: uuidv4(),
        title: req.body.title,
        content: req.body.description,
        price: req.body.price,
        category_id: req.body.category,
        image_id: req.body.image,
        user_id: id
    }

    let sql = "INSERT INTO items SET ?";
    pool.query(sql, [newItems], function (error, result) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            res.redirect('/profile/' + id)
        }
    });

}
