import pool from "../config/database.js";

export const home = (req, res) => {
    // Requête pour obtenir les articles récents
    const recentArticles = `
        SELECT articles.id, articles.title, articles.description, category_articles.name as 'category'
        FROM articles
                 INNER JOIN category_articles ON articles.category_id = category_articles.id
        ORDER BY articles.date DESC
        LIMIT 5
    `;

    // Requête pour obtenir les éléments récents
    const recentItems = `
        SELECT u.pseudo, i.url, i.description, items.price, items.id
        FROM items
                 INNER JOIN users u ON items.user_id = u.id
                 INNER JOIN images i ON items.image_id = i.id
        LIMIT 5
    `;

    // Exécuter la requête pour obtenir les articles récents
    pool.query(recentArticles, (erreurArticles, articles) => {
        if (erreurArticles) {
            console.error(erreurArticles);
            return;
        }

        // Exécuter la requête pour obtenir les éléments récents
        pool.query(recentItems, (erreurElements, items) => {
            if (erreurElements) {
                console.error(erreurElements);
                return;
            }

            // Rendre le modèle 'home' avec les articles et les éléments récupérés
            res.render('layout', {template: 'home', items: items, articles: articles});
        });
    });
};
