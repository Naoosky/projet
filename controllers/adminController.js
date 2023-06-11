import pool from "../config/database.js";

export const admin = (req,res) => {

    let sql = ` SELECT * FROM users`;
    pool.query(sql, (error,users) => {
        if(error){
            console.error(error)
        }else{
            let query = "SELECT * FROM articles";
            pool.query(query, (error, articles) => {
                if(error){
                    console.error(error)
                }else{
                    res.render('layout', {template: 'admin', users: users, articles: articles});
                }
            });
        }
    });
}

export const usersProfil = (req,res) => {
    const id = req.params.id
    let sql = ` SELECT * FROM users WHERE id = ?`;
    pool.query(sql,id, (error,user) => {
        if(error){
            console.error(error)
        }else{
            res.render('layout', {template: 'usersProfil', user: user[0]});
        }
    });
}

export const deleteArticle = (req,res) => {
    const id = req.params.id
    let sql = ` DELETE FROM articles WHERE id = ?`;
    pool.query(sql,id, (error) => {
        if(error){
            console.error(error)
        }else{
            res.redirect('/administration');
        }
    });
}