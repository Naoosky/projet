import pool from "../config/database.js";

export const auction = (req, res) => {
    let sql = " SELECT * FROM items";
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
    let sql = "SELECT * FROM images";
    pool.query(sql, function (error, result) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            res.render('layout', {template: 'addItems', images: result});
        }
    });
}

export const addItemsSubmit = (req, res) => {
    let id = req.session.userId
    let newItems = {

    }
    let sql = "INSERT INTO items SET ?";
    pool.query(sql, [newItems], function (error, result) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            res.redirect('/profile'+id)
        }
    });

}
