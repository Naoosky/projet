// importation des modules nécessaires
import pool from "../config/database.js"; // importation pour la connexion à la base de données
import {v4 as uuidv4} from 'uuid'; // module npm pour la génération d'uuid
import xss from 'xss'; // module npm pour la protection contre les failles XSS
import bcrypt from "bcrypt"; // module npm pour crypter les mots de passe


export const register = (req, res) => {
    res.render('layout', {template: 'register'});
}

export const registerSubmit = function (req, res) {

    // recuperation des données du formulaire dans req.body
    const {email, pseudo, password, confirmPassword} = req.body;

    // regex pour l'email (format valide) et pour le pseudo (pas de caractères spéciaux)
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
    const inputRegex = /^[a-zA-Z0-9\s]+$/;

    // protection contre les failles XSS (cross-site scripting)
    const safeEmail = xss.escapeHtml(email);
    const safePseudo = xss.escapeHtml(pseudo);
    const safePassword = xss.escapeHtml(password);
    const safeConfirmPassword = xss.escapeHtml(confirmPassword);

    // vérification des données du formulaire si les données ne sont pas valides, on renvoie un message d'erreur
    if (!emailRegex.test(safeEmail)) {
        return res.status(400).send('L\'e-mail n\'est pas valide');
    }
    if (safePseudo.length < 3 || !inputRegex.test(safePseudo)) {
        return res.status(400).send('Le pseudo doit contenir au moins 3 caractères et ne doit pas contenir de caractères spéciaux');
    }
    if (safePassword.length < 8) {
        return res.status(400).send('Le mot de passe doit contenir au moins 8 caractères');
    }
    if (safeConfirmPassword !== safePassword ) {
        return res.status(400).send('La confirmation du mot de passe ne correspond pas ou contient des caractères spéciaux');
    }

    // cryptage du mot de passe avec bcrypt
    bcrypt.hash(safePassword, 10, function (error, hash) {
        if (error) {
            console.log(error);
        } else {

            // recuperation des données du formulaire dans un objet newUsers
            const newUsers = {
                id: uuidv4(), // on génère un id unique avec uuid
                pseudo: safePseudo,
                email: safeEmail,
                password: hash, // le mot de passe crypté
                role: "Membre" // par défaut, le role est "Membre"
            };

            // requète SQL pour insérer les données du formulaire dans la table users
            let query = "INSERT INTO users SET ?";

            // execution de la requète SQL avec les données de l'objet newUsers
            pool.query(query, [newUsers], function (error, result) {
                if (error) {
                    console.error(error);
                    res.status(500).send('Erreur de base de données');
                } else {

                    // si l'inscription est réussie, on redirige vers la page d'accueil et on connecte l'utilisateur
                    req.session.isUser = true;
                    req.session.userId = newUsers.id; // on stocke l'id de l'utilisateur dans la session
                    res.redirect('/');
                }
            });
        }
    });
}