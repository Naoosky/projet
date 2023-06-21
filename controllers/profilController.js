import pool from "../config/database.js";

export const profile = (req, res) => {
    let id = req.session.userId
    if (!id) {
        res.redirect('/')
    } else {
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
                        let sql = `SELECT items.id,
                                          items.title,
                                          items.content,
                                          items.price,
                                          images.url,
                                          images.description
                                   FROM items
                                            INNER JOIN images ON image_id = images.id
                                   WHERE user_id = ?`;
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

}

export const deleteArticle = (req, res) => {
    const id = req.params.id
    const userId = req.session.userId

    let sql = 'SELECT * FROM articles WHERE id = ?';
    pool.query(sql, [id], function (error, result) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            if (result[0].user_id !== userId) {
                res.status(403).send('Forbidden')
            } else {
                let sql2 = ` DELETE
                             FROM articles
                             WHERE id = ?`;
                pool.query(sql2, [id], function (error) {
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
        }
    });
}

export const deleteItem = (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId

    let sql = 'SELECT * FROM items WHERE id = ?';
    pool.query(sql, [id], function (error, result) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            if (result[0].user_id !== userId) {
                res.status(403).send('Forbidden')
            } else {
                let sql2 = ` DELETE
                             FROM items
                             WHERE id = ?`;
                pool.query(sql2, [id], function (error) {
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
        }
    });
}