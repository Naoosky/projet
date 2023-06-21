import express from "express";
import session from "express-session";
import rateLimit from 'express-rate-limit';
import router from "./routes/router.js";
import parseurl from "parseurl";

const APP_PORT = 3000;

const app = express();

// on indique à express où sont les fichiers statiques js, image et css
app.use(express.static("public"));

//pour l’utilisation du json à la réception des données formulaire
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Créer une limite de 100 requêtes par heure
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 100, // Limite de 100 requêtes par IP
    message: 'Trop de requêtes effectuées depuis cette adresse IP. Veuillez réessayer plus tard.',
});

// Utiliser le rate limiter comme middleware global
app.use(limiter);

//pour l’utilisation des sessions
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 7200000}
}));

// utilisation des template EJS grâce aux modules npm "ejs"
app.set('views', './views');
app.set('view engine', 'ejs');
app.set('view options', {pretty: true});

// Creation d'un middleware pour les sessions Admin et Member
app.use((req, res, next) => {
    res.locals.isAdmin = !!req.session.isAdmin;
    res.locals.isUser = !!req.session.isUser;
    res.locals.userId = req.session.userId;
    next();
})

// Creation de routes protégées pour l’administration
app.use((req, res, next) => {
    const route = parseurl(req).pathname;

    const adminProtectedRoutes = ['/administration', '/administration/articles/', '/administration/users/','/delete/users/'];
    const userProtectedRoutes = ['/profil', '/delete/articles/', '/delete/items/'];

    if(userProtectedRoutes.indexOf(route) > -1 && !req.session.isUser) {
        res.redirect("/");
    }else{
        next();
    }

    if (adminProtectedRoutes.indexOf(route) > -1 && !req.session.isAdmin) {
        res.redirect("/")
    } else {
        next();
    }

});

//appel du routeur
app.use('/', router);

// lancement du serveur sur un port choisi (ici 3000)
app.listen(APP_PORT, () => {
    console.log(`Server lancer sur http://localhost:${APP_PORT}`)
});