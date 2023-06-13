// Import necessary modules
import pool from "../config/database.js"; // Import for database connection
import {v4 as uuidv4} from 'uuid';  // npm module for generating UUID
import xss from 'xss';  // npm module for protection against XSS vulnerabilities
import bcrypt from "bcrypt"; // npm module for password encryption


export const register = (req, res) => {
    res.render('layout', {template: 'register', error: null});
}

export const registerSubmit = function (req, res) {

    // Get form data from req.body
    const {email, pseudo, password, confirmPassword} = req.body;

    // Regular expressions for email (valid format) and pseudo (no special characters)
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
    const inputRegex = /^[a-zA-Z0-9\s]+$/;

    // Protection against XSS (Cross-Site Scripting) vulnerabilities
    const safeEmail = xss(email);
    const safePseudo = xss(pseudo);
    const safePassword = xss(password);
    const safeConfirmPassword = xss(confirmPassword);

    // Validate form data, if the data is invalid, return an error message
    if (!emailRegex.test(safeEmail)) {
        return res.render('layout', {template: 'register', error: 'L\'email n\'est pas valide'});
    }
    if (safePseudo.length < 3 || !inputRegex.test(safePseudo)) {
        return res.render('layout', {template: 'register',
            error: 'Le pseudo doit contenir au moins 3 caractères et ne doit pas contenir de caractères spéciaux'});
    }
    if (safePassword.length < 8) {
        return res.render('layout', {template: 'register', error: 'Le mot de passe doit contenir au moins 8 caractères'});
    }
    if (safeConfirmPassword !== safePassword ) {
        return res.render('layout', {template: 'register', error: 'Les mots de passe ne correspondent pas'});
    }

    // Encrypt password using bcrypt
    bcrypt.hash(safePassword, 10, function (error, hash) {
        if (error) {
            console.log(error);
        } else {

            // Create an object newUsers with form data
            const newUsers = {
                id: uuidv4(), // Generate a unique ID using UUID
                pseudo: safePseudo,
                email: safeEmail,
                password: hash, // Encrypted password
                role: "Membre" // By default, the role is "Member"
            };

            // SQL query to insert form data into the users table
            let query = "INSERT INTO users SET ?";

            // Execute the SQL query with data from the newUsers object
            pool.query(query, [newUsers], function (error, result) {
                if (error) {
                    console.error(error);
                    res.status(500).send('Erreur de base de données');
                } else {

                    // If registration is successful, redirect to the homepage and log in the user
                    req.session.isUser = true;
                    req.session.userId = newUsers.id; // Store the user ID in the session
                    res.redirect('/');
                }
            });
        }
    });
}