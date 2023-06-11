import express from "express";
const router = express.Router();
import {home} from '../controllers/homeController.js';
import {admin, usersProfil, deleteArticle} from '../controllers/adminController.js';
import {forum, articlesDetails, addComments, addArticles, addArticlesSubmit} from '../controllers/forumController.js';
import {auction} from '../controllers/auctionController.js';
import {login, loginSubmit} from '../controllers/loginController.js';
import {register, registerSubmit} from '../controllers/registerController.js';
import {logOut} from "../controllers/logOutController.js";
import {profile} from "../controllers/profilController.js";
import {privacyPolicy} from "../controllers/privacyPolicyController.js";

router.get('/', home);
router.get('/administration', admin)
router.get('/administration/users/:id', usersProfil)
router.delete('/administration/articles/:id', deleteArticle);
router.get('/forum', forum);
router.get('/articles/:id', articlesDetails);
router.get('/add/articles/:id', addArticles);
router.post('/add/articles/:id', addArticlesSubmit);
router.post('/add_comment/:id', addComments)
router.get('/auction', auction);
router.get('/login', login);
router.post('/login', loginSubmit);
router.get('/register', register);
router.post('/register', registerSubmit);
router.get('/logout', logOut);
router.get('/profile/:id', profile);
router.get('/privacyPolicy', privacyPolicy);


export default router;
