import pool from "../config/database.js";

// Page d'administration
export const admin = (req, res) => {
    if (!req.session.isAdmin) {
        res.redirect('/');
    } else {
        // Requête pour récupérer tous les utilisateurs
        let sql = `SELECT id,pseudo,role
                   FROM users`;
        pool.query(sql, (error, users) => {
            if (error) {
                console.error(error);
            } else {
                // Requête pour récupérer tous les articles
                let query = "SELECT id, title, description FROM articles";
                pool.query(query, (error, articles) => {
                    if (error) {
                        console.error(error);
                    } else {
                        // Rendu de la page admin avec les utilisateurs et les articles
                        res.render('layout', {template: 'admin', users: users, articles: articles});
                    }
                });
            }
        });
    }
};

// Profil utilisateur
export const usersProfil = (req, res) => {
    if (!req.session.isAdmin) {
        res.redirect('/');
    } else {
        const id = req.params.id;
        // Requête pour récupérer les informations de l'utilisateur
        let query = "SELECT id, pseudo FROM users WHERE id = ?";
        pool.query(query, [id], function (error, result) {
            if (error) {
                console.error(error);
                res.status(500).send('erreur de bdd');
            } else {
                // Requête pour récupérer les articles de l'utilisateur
                const query = "SELECT id, title, description FROM articles WHERE user_id = ?";
                pool.query(query, [id], (error, articles) => {
                    if (error) {
                        console.error(error);
                    } else {
                        // Requête pour récupérer les items de l'utilisateur avec les images correspondantes
                        let sql = "SELECT items.id, items.title, items.content, items.price, images.url, images.description FROM items INNER JOIN images ON image_id = images.id WHERE user_id = ?";
                        pool.query(sql, [id], function (error, items) {
                            if (error) {
                                console.error(error);
                                res.status(500).send('erreur de bdd');
                            } else {
                                // Rendu de la page de profil de l'utilisateur avec ses informations, articles et items
                                res.render('layout', {
                                    template: 'usersProfil',
                                    user: result[0],
                                    items: items,
                                    articles: articles
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};

// Supprimer un utilisateur
export const deleteUser = (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId;

    // Vérification si l'utilisateur supprime son propre compte
    if (userId === id) {
        let sql = `DELETE
                   FROM users
                   WHERE id = ?`;
        pool.query(sql, id, function (error) {
            if (error) {
                console.log(error);
                res.status(500).send({
                    error: 'Error when deleting user'
                });
            } else {
                req.session.destroy();
                res.redirect('/');
            }
        });
    }
    // Vérification si l'utilisateur est administrateur et supprime le compte d'un autre utilisateur
    else if (req.session.isAdmin) {
        let sql = `DELETE
                   FROM users
                   WHERE id = ?`;
        pool.query(sql, id, function (error) {
            if (error) {
                console.log(error);
                res.status(500).send({
                    error: 'Error when deleting user'
                });
            } else {
                res.status(200).send();
            }
        });
    }
    // L'utilisateur n'est pas autorisé à supprimer le compte
    else {
        res.status(403).send('Forbidden');
    }
};
