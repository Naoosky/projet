import pool from "../config/database.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";

export const register = (req, res) => {
    res.render('layout', {template: 'register'});
}

export const registerSubmit = function (req, res) {
    bcrypt.hash(req.body.password, 10, function (error, hash) {
        if (error) {
            console.log(error);
        } else {
            const newUsers = {
                id: uuidv4(),
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: hash,
                role: "Membre"
            };
            let query = "INSERT INTO users SET ?";

            pool.query(query, [newUsers], function (error, result) {
                if (error) {
                    console.error(error);
                    res.status(500).send('Erreur de base de données');
                } else {
                    req.session.isUser = true;
                    req.session.userId = newUsers.id;
                    res.redirect('/');
                }
            });
        }
    });
}