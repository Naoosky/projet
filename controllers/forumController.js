import pool from "../config/database.js";
import {v4 as uuidV4} from 'uuid';
import xss from 'xss';


export const listArticles = (req, res) => {
    let sql = ` SELECT articles.id,
                       articles.title,
                       users.pseudo,
                       articles.description,
                       category_articles.name,
                       articles.date
                FROM articles
                         INNER JOIN category_articles ON articles.category_id = category_articles.id
                         INNER JOIN users ON user_id = users.id
                ORDER BY articles.date DESC`;

    pool.query(sql, function (error, articles) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            res.render('layout', {template: 'listArticles', articles: articles});
        }
    });
}

export const searchArticles = (req, res) => {
    const search = req.body.search;
    let sql = ` SELECT *
                FROM articles
                         INNER JOIN category_articles ON articles.category_id = category_articles.id
                         INNER JOIN users ON user_id = users.id
                WHERE category_articles.name LIKE '%${search}%' `;
    pool.query(sql, function (error, articles) {
        if (error) {
            console.error(error)
            res.status(500).send('erreur de bdd')
        } else {
            res.render('layout', {template: 'listArticles', articles: articles});
        }
    });
}

export const articlesDetails = (req, res) => {
    const id = req.params.id
    let sql = `
        SELECT articles.id,
               articles.title,
               articles.description,
               articles.date,
               category_articles.name as 'category',
               comments.pseudo,
               comments.comment,
               comments.date          as 'dateComments'
        FROM articles
                 INNER JOIN category_articles ON articles.category_id = category_articles.id
                 LEFT JOIN comments ON comments.article_id = articles.id
        WHERE articles.id = ?

    `;
    pool.query(sql, id, (error, results) => {
        if (error) {
            console.error(error)
        } else {

            res.render('layout', {template: 'detailArticles', articles: results, error: null})
        }
    })
}

export const addComments = (req, res) => {
    const id = req.params.id
    let sql = `
        SELECT articles.id,
               articles.title,
               articles.description,
               articles.date,
               category_articles.name as 'category',
               comments.pseudo,
               comments.comment,
               comments.date          as 'dateComments'
        FROM articles
                 INNER JOIN category_articles ON articles.category_id = category_articles.id
                 LEFT JOIN comments ON comments.article_id = articles.id
        WHERE articles.id = ?

    `;
    pool.query(sql, id, (error, results) => {
        if (error) {
            console.error(error)
        } else {
            const userId = req.session.userId
            const {comment} = req.body

            const safeComment = xss(comment)

            if (safeComment.length < 3) {
                return res.render('layout', {
                    template: 'detailArticles',
                    articles: results,
                    error: 'Le commentaire doit contenir au moins 3 caractères et moins de 255 caractères'
                });
            } else if (safeComment.length > 255) {
                return res.render('layout', {
                    template: 'detailArticles',
                    articles: results,
                    error: 'Le commentaire doit contenir au moins 3 caractères et moins de 255 caractères'
                });
            }

            const sql2 = 'SELECT * FROM users WHERE id = ?';

            pool.query(sql2, userId, (error, user) => {
                if (error) {
                    console.error(error)
                } else {
                    const newCommentUser = {
                        id: uuidV4(),
                        pseudo: user[0].pseudo,
                        comment: safeComment,
                        article_id: id
                    }

                    let sql3 = 'INSERT INTO comments SET ?';

                    pool.query(sql3, newCommentUser, (error) => {
                        if (error) {
                            console.error(error)
                        } else {
                            res.redirect('/articles/' + id)
                        }
                    });
                }
            });
        }
    })

}

export const addArticles = (req, res) => {
    let userId = req.session.userId;

    if (!userId) return res.redirect('/login')

    const query = 'SELECT * FROM category_articles';
    pool.query(query, (error, category) => {
        if (error) {
            console.error(error)
        } else {
            const sql = 'SELECT * FROM users WHERE id = ?';
            pool.query(sql, userId, (error, user) => {
                if (error) {
                    console.error(error)
                } else {
                    res.render('layout', {template: 'addArticles', category: category, user: user[0], error: null})
                }
            });
        }
    });
}

export const addArticlesSubmit = (req, res) => {
    const id = req.session.userId
    const query = `SELECT *
                   FROM category_articles`;
    pool.query(query, (error, category) => {
        if (error) {
            console.error(error)
        } else {
            let sql = 'SELECT * FROM users WHERE id = ?';
            pool.query(sql, id, (error, user) => {
                const {title, description, categories} = req.body

                const safeTitle = xss(title)
                const safeDescription = xss(description)


                if (safeTitle.length < 3 || safeTitle.length > 50) {
                    return res.render('layout', {
                        template: 'addArticles',
                        category: category,
                        user: user[0],
                        error: 'Le titre doit contenir au moins 3 caractères ou dépassé les 50 caractères'
                    });
                }
                if (safeDescription.length < 3) {
                    return res.render('layout', {
                        template: 'addArticles',
                        category: category,
                        user: user[0],
                        error: 'La description doit contenir au moins 3 caractères'
                    });
                }
                if (category === '0') {
                    return res.render('layout', {
                        template: 'addArticles',
                        category: category,
                        user: user[0],
                        error: 'Veuillez choisir une catégorie'
                    });
                }


                const newArticle = {
                    id: uuidV4(),
                    title: safeTitle,
                    description: safeDescription,
                    category_id: categories,
                    user_id: id
                }
                let sql = `INSERT INTO articles
                           SET ?`;
                pool.query(sql, newArticle, (error) => {
                    if (error) {
                        console.error(error)
                    } else {
                        res.redirect('/profile/' + id)
                    }
                })

            });
        }
    });
}

export const editArticle = (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId;

    const sql = `SELECT articles.id, articles.title, articles.description, users.id as "userId"
                 FROM articles
                          INNER JOIN users ON articles.user_id = users.id
                 WHERE articles.id = ?`;

    pool.query(sql, [id], (error, article) => {
        if (error) {
            console.error(error);
            return;
        }

        const articleData = article[0];

        if (!articleData || articleData.userId !== userId) {
            // Si l'article n'existe pas ou n'appartient pas à l'utilisateur
            return res.redirect('/profile/' + userId);
        }

        const sql2 = 'SELECT * FROM category_articles';
        pool.query(sql2, (error, category) => {
            if (error) {
                console.error(error);
                return;
            }

            res.render('layout', {
                template: 'editArticle',
                article: articleData,
                category: category,
                error: null
            });
        });
    });
};
export const editArticleSubmit = (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId;

    const sql = `SELECT articles.id, articles.title, articles.description, users.id as "userId"
                 FROM articles
                          INNER JOIN users ON articles.user_id = users.id
                 WHERE articles.id = ?`;

    pool.query(sql, [id], (error, article) => {
        if (error) {
            console.error(error);
            return;
        }

        const articleData = article[0];

        if (!articleData || articleData.userId !== userId) {
            // Si l'article n'existe pas ou n'appartient pas à l'utilisateur
            return res.redirect('/profile/' + userId);
        }

        const sql2 = 'SELECT * FROM category_articles';
        pool.query(sql2, (error, category) => {
            if (error) {
                console.error(error);
                return;
            }

            const {title, description, categories} = req.body;

            const safeTitle = xss(title);
            const safeDescription = xss(description);

            if (safeTitle.length < 3 || safeTitle.length > 50) {
                return res.render('layout', {
                    template: 'editArticle',
                    article: articleData,
                    category,
                    error: 'Le titre doit contenir au moins 3 caractères ou dépasser les 50 caractères'
                });
            }

            if (safeDescription.length < 3) {
                return res.render('layout', {
                    template: 'editArticle',
                    article: articleData,
                    category,
                    error: 'La description doit contenir au moins 3 caractères'
                });
            }

            if (categories === '0') {
                return res.render('layout', {
                    template: 'editArticle',
                    article: articleData,
                    category,
                    error: 'Veuillez choisir une catégorie'
                });
            }

            const editArticle = {
                title: safeTitle,
                description: safeDescription,
                category_id: categories
            };

            if (articleData.userId !== userId) {
                return res.redirect('/profile/' + userId);
            }

            const sql3 = 'UPDATE articles SET ? WHERE id = ?';
            pool.query(sql3, [editArticle, id], (error) => {
                if (error) {
                    console.error(error);
                    return;
                }

                res.redirect('/profile/' + userId);
            });
        });
    });
};