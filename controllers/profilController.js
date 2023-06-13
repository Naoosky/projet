import pool from "../config/database.js";

export const profile = (req, res) => {
    let id = req.session.userId

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
                                template: 'profile',
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