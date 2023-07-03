import pool from "../config/database.js"; // Importation du module de connexion à la base de données
import bcrypt from 'bcrypt'; // Importation du module de hachage de mot de passe
import xss from 'xss'; // Importation du module de protection contre les attaques XSS

export const profile = (req, res) => {
    const id = req.session.userId;

    if (!id) {
        return res.redirect('/');
    }

    let query = "SELECT * FROM users WHERE id = ?";
    // Requête pour récupérer les informations de l'utilisateur courant
    pool.query(query, [id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        const userId = result[0].id;

        const articlesQuery = "SELECT * FROM articles WHERE user_id = ?";
        // Requête pour récupérer les articles de l'utilisateur
        pool.query(articlesQuery, [userId], (error, articles) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erreur de base de données');
            }

            let itemsQuery = `SELECT items.id,
                                     items.title,
                                     items.content,
                                     items.price,
                                     images.url,
                                     images.description
                                FROM items
                                       INNER JOIN images ON image_id = images.id
                               WHERE user_id = ?`;
            // Requête pour récupérer les items de l'utilisateur avec les images correspondantes
            pool.query(itemsQuery, [userId], (error, items) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Erreur de base de données');
                }

                // Rendu de la page de profil avec les informations récupérées
                res.render('layout', {
                    template: 'profile', user: result[0], items: items, articles: articles
                });
            });
        });
    });
};

export const deleteArticle = (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId;

    let sql = 'SELECT * FROM articles WHERE id = ?';
    // Requête pour récupérer les informations de l'article à supprimer
    pool.query(sql, [id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        // Vérification des autorisations de suppression (administrateur ou propriétaire de l'article)
        if (req.session.isAdmin || result[0].user_id === userId) {
            let sql2 = `DELETE
                        FROM articles
                        WHERE id = ?`;
            // Requête de suppression de l'article
            pool.query(sql2, [id], (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send({error: 'Erreur lors de la suppression de l\'article'});
                }

                res.status(204).send(); // Renvoi d'une réponse indiquant que la suppression a réussi
            });
        } else {
            res.status(403).send('Interdit'); // Renvoi d'une réponse d'interdiction si l'utilisateur n'est pas autorisé
        }
    });
};

export const deleteItem = (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId;

    let sql = 'SELECT * FROM items WHERE id = ?';
    // Requête pour récupérer les informations de l'item à supprimer
    pool.query(sql, [id], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        // Vérification des autorisations de suppression (administrateur ou propriétaire de l'item)
        if (req.session.isAdmin || result[0].user_id === userId) {
            let sql2 = `DELETE
                        FROM items
                        WHERE id = ?`;
            // Requête de suppression de l'item
            pool.query(sql2, [id], (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send({error: 'Erreur lors de la suppression de l\'article'});
                }

                res.status(204).send(); // Renvoi d'une réponse indiquant que la suppression a réussi
            });
        } else {
            res.status(403).send('Interdit'); // Renvoi d'une réponse d'interdiction si l'utilisateur n'est pas autorisé
        }
    });
};

export const profilSetting = (req, res) => {
    const id = req.params.id;

    if (req.session.userId !== id) {
        return res.redirect('/');
    }

    let sql = `SELECT *
               FROM users
               WHERE id = ?`;

    pool.query(sql, [id], (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        res.render('layout', {template: 'profilSetting', user: user[0]});
    });
};

export const editProfil = (req, res) => {
    const id = req.params.id;

    if (req.session.userId !== id) {
        return res.redirect('/');
    }

    let sql = `SELECT *
               FROM users
               WHERE id = ?`;

    pool.query(sql, [id], (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        res.render('layout', {template: 'editProfil', user: user[0], error: null});
    });
};

export const editProfilSubmit = (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId;

    if (userId !== id) {
        return res.redirect('/');
    }

    let sql = `SELECT *
               FROM users
               WHERE id = ?`;

    pool.query(sql, [id], (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        const {pseudo, email, password} = req.body;
        const safePseudo = xss(pseudo);
        const safeEmail = xss(email);
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
        const inputRegex = /^[a-zA-Z0-9\s]+$/;

        if (!emailRegex.test(safeEmail)) {
            return res.render('layout', {
                template: 'editProfil', user: user[0], error: "Votre email n'est pas correct"
            });
        }
        if (safePseudo.length < 3 || !inputRegex.test(safePseudo)) {
            return res.render('layout', {
                template: 'editProfil', user: user[0], error: "Votre pseudo n'est pas correct"
            });
        }

        bcrypt.compare(password, user[0].password, (error, isAllowed) => {
            if (isAllowed) {
                const editProfil = {
                    pseudo: safePseudo, email: safeEmail,
                };

                let sql2 = 'UPDATE users SET ? WHERE id = ?';
                pool.query(sql2, [editProfil, userId], (error) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).send('Erreur de base de données');
                    }

                    res.redirect('/profile/' + userId);
                });
            } else {
                res.render('layout', {template: 'editProfil', error: "Le mot de passe n'est pas correct"});
            }
        });
    });
};

export const editPassword = (req, res) => {
    const id = req.params.id;

    if (req.session.userId !== id) {
        return res.redirect('/');
    }

    let sql = 'SELECT * FROM users WHERE id = ?';
    pool.query(sql, [id], (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        res.render('layout', {template: 'editPassword', user: user[0], error: null});
    });
};

export const editPasswordSubmit = (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId;

    if (userId !== id) {
        return res.redirect('/');
    }

    let sql = 'SELECT * FROM users WHERE id = ?';
    pool.query(sql, [id], (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        const {oldPassword, newPassword, confirmPassword} = req.body;

        bcrypt.compare(oldPassword, user[0].password, (error, isAllowed) => {
            if (isAllowed) {
                const safeNewPassword = xss(newPassword);

                if (safeNewPassword !== confirmPassword) {
                    return res.render('layout', {
                        template: 'editPassword', user: user[0], error: "La confirmation ne correspond pas"
                    });
                }

                bcrypt.hash(safeNewPassword, 10, (error, hash) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).send('Erreur de hachage du mot de passe');
                    }

                    const newPassword = {
                        password: hash,
                    };

                    let sql2 = 'UPDATE users SET ? WHERE id = ?';
                    pool.query(sql2, [newPassword, userId], (error) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).send('Erreur de base de données');
                        }

                        res.redirect('/profile/' + userId);
                    });
                });
            } else {
                res.render('layout', {
                    template: 'editProfil', user: user[0], error: "L'ancien mot de passe n'est pas correct"
                });
            }
        });
    });
};