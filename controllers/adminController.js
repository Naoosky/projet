import pool from "../config/database.js";

export const admin = (req, res) => {

    let sql = ` SELECT *
                FROM users`;
    pool.query(sql, (error, users) => {
        if (error) {
            console.error(error)
        } else {
            let query = "SELECT * FROM articles";
            pool.query(query, (error, articles) => {
                if (error) {
                    console.error(error)
                } else {
                    res.render('layout', {template: 'admin', users: users, articles: articles});
                }
            });
        }
    });
}

export const usersProfil = (req, res) => {
    const id = req.params.id

    let query = "SELECT * FROM users WHERE id = ?";
    pool.query(query, [id], function (error, result) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            const query = "SELECT * FROM articles WHERE user_id = ?";
            pool.query(query, [id], (error, articles) => {
                if (error) {
                    console.error(error)
                } else {
                    let sql = "SELECT * FROM items INNER JOIN images ON image_id = images.id WHERE user_id = ?";
                    pool.query(sql, [id], function (error, items) {
                        if (error) {
                            console.error(error)
                            res.status(500).send('erreur de bdd')
                        } else {
                            res.render('layout', {
                                template: 'usersProfil',
                                user: result[0],
                                items: items,
                                articles: articles
                            })
                        }
                    });
                }
            });
        }
    });
}

export const deleteUser = (req, res) => {
    const id = req.params.id;
    let sql = ` DELETE
                FROM users
                WHERE id = ?`;
    pool.query(sql, id, function (error) {
        if (error) {
            console.log(error)
            res.status(500).send({
                error: 'Error when delete post'
            });
        } else {
            res.status(204).send();
        }
    });
}