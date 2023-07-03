import pool from "../config/database.js";
import bcrypt from "bcrypt";

export const login = (req, res) => {
    // Afficher la page de connexion avec un message d'erreur null
    res.render('layout', {template: 'login', error: null});
};

export const loginSubmit = (req, res) => {
    // Récupération des données du formulaire dans req.body
    // Utilisation des noms des inputs comme clés de req.body
    const {email, password} = req.body;
    const query = "SELECT * FROM users WHERE email = ?";

    pool.query(query, [email], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        if (result.length < 1) {
            // Afficher la page de connexion avec un message d'erreur spécifique si aucun utilisateur n'est trouvé
            return res.render('layout', {template: 'login', error: "L'email ou le mot de passe est incorrect"});
        }

        const user = result[0];
        bcrypt.compare(password, user.password, (error, isAllowed) => {
            if (isAllowed) {
                // Enregistrer l'ID de l'utilisateur dans la session
                req.session.userId = user.id;

                if (user.role === 'Admin') {
                    // Définir la session en tant qu'administrateur si l'utilisateur a un rôle d'admin
                    req.session.isAdmin = true;
                } else {
                    // Définir la session en tant qu'utilisateur normal
                    req.session.isUser = true;
                }

                // Rediriger vers la page d'accueil après la connexion réussie
                res.redirect("/");
            } else {
                // Afficher la page de connexion avec un message d'erreur si le mot de passe est incorrect
                res.render('layout', {template: 'login', error: "L'email ou le mot de passe est incorrect"});
            }
        });
    });
};

export const logOut = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erreur de base de données');
        }

        // Rediriger vers la page d'accueil après la déconnexion réussie
        res.redirect('/');
    });
};
