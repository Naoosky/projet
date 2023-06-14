import pool from "../config/database.js";
import {v4 as uuidV4} from 'uuid';


export const forum = (req, res) => {
    res.render('layout', {template: 'forum'});
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

            res.render('layout', {template: 'articles', articles: results})
        }
    })
}

export const addComments = (req, res) => {
    const id = req.params.id

    if (req.session.isUser) {

        const userId = req.session.userId
        const sql = 'SELECT * FROM users WHERE id = ?';

        pool.query(sql, userId, (error, user) => {
            if (error) {
                console.error(error)
            } else {
                const newCommentUser = {
                    id: uuidV4(),
                    pseudo: user[0].pseudo,
                    comment: req.body.comment,
                    article_id: id
                }

                let sql = 'INSERT INTO comments SET ?';

                pool.query(sql, newCommentUser, (error) => {
                    if (error) {
                        console.error(error)
                    } else {
                        res.redirect('/articles/' + id)
                    }
                });
            }
        });

    } else {

        const newComment = {
            id: uuidV4(),
            pseudo: req.body.pseudo,
            comment: req.body.comment,
            article_id: id
        }
        let sql2 = "INSERT INTO comments SET  ?";
        pool.query(sql2, newComment, (error) => {
            if (error) {
                console.error(error)
            } else {
                res.redirect('/articles/' + id)
            }
        })
    }
}

export const addArticles = (req, res) => {
    let id = req.params.id
    const query = 'SELECT * FROM category_articles';
    pool.query(query, (error, category) => {
        if (error) {
            console.error(error)
        } else {
            const sql = 'SELECT * FROM users WHERE id = ?';
            pool.query(sql, id, (error, user) => {
                if (error) {
                    console.error(error)
                } else {
                    res.render('layout', {template: 'addArticles', category: category, user: user[0]});
                }
            });
        }
    });
}

export const addArticlesSubmit = (req, res) => {
    const id = req.session.userId
    const newArticle = {
        id: uuidV4(),
        title: req.body.title,
        description: req.body.description,
        category_id: req.body.category,
        user_id: req.body.user
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
}