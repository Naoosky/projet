import pool from "../config/database.js";
import bcrypt from "bcrypt";

export const login = (req, res) => {
    res.render('layout', {template: 'login'});
}

export const loginSubmit = (req, res) => {
    // récupération des données du formulaire dans req.body
    // on utilise les name des input comme clefs de req.body
    const {email,password} = req.body;
    let query = "SELECT * FROM users WHERE email = ?";

    pool.query(query, [email], function (error, result) {
        if(error){
            console.error(error)
            res.status(500).send('erreur de bdd')
        }else{
            if (result.length < 1) {
                res.redirect('/login')
            }else{
                bcrypt.compare(password, result[0].password, (error,isAllowed) =>{
                    if(isAllowed){
                        req.session.userId = result[0].id;

                        if(result[0].role === 'Admin'){
                            req.session.isAdmin = true;
                            res.redirect("/")
                        }else{
                            req.session.isUser = true;
                            res.redirect("/")

                        }
                    }else{
                        res.redirect('/login')
                    }
                })
            }
        }
    });
}