import pool from "../config/database.js";

export const home = (req, res) => {

    let sql = `
        SELECT articles.id, articles.title, articles.description, category_articles.name as 'category'
        FROM articles
                 INNER JOIN category_articles ON articles.category_id = category_articles.id
        ORDER BY articles.date DESC
        LIMIT 5

    `;

    pool.query(sql, (error, results) => {
        if (error) {
            console.error(error)
        } else {
            res.render('layout', {template: 'home', articles: results});
        }
    })


}
