import pool from "../config/database.js";
import { v4 as uuidv4 } from 'uuid';


export const forum = (req, res) => {
    res.render('layout', {template: 'forum'});
}

export const articlesDetails = (req,res) => {
    const id = req.params.id
    let sql = `
    SELECT articles.id, articles.title, articles.description, articles.date, category_articles.name as 'category', comments.pseudo, comments.comment, comments.date as 'dateComments'
      FROM articles
           INNER JOIN category_articles ON articles.category_id = category_articles.id
           LEFT JOIN comments ON comments.article_id  = articles.id 
     WHERE articles.id = ?
           
    `;
    pool.query(sql,id, (error,results) => {
        if(error){
            console.error(error)
        }else{

            res.render('layout', {template: 'articles', articles: results})
        }
    })
}

export const addComments = (req,res) => {
    const id = req.params.id

    const newComment = {
        id: uuidv4(),
        pseudo: req.body.pseudo,
        comment: req.body.comment,
        article_id: id
    }
    let sql = `INSERT INTO comments SET ?`;
    pool.query(sql,newComment, (error,results) =>{
        if(error){
            console.error(error)
        }else{
            res.redirect('/articles/'+id)
        }
    })
}
