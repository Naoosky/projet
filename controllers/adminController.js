import pool from "../config/database.js";

export const admin = (req,res) => {
    res.render('layout', {template: 'admin'});
}