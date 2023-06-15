import express from "express";
const router = express.Router();
import {home} from '../controllers/homeController.js';
import {admin, usersProfil} from '../controllers/adminController.js';
import {forum, articlesDetails, addComments, addArticles, addArticlesSubmit, searchArticles} from '../controllers/forumController.js';
import {auction, addItems, addItemsSubmit, searchItems} from '../controllers/auctionController.js';
import {login, loginSubmit, logOut} from '../controllers/loginController.js';
import {register, registerSubmit} from '../controllers/registerController.js';
import {profile,  deleteArticle, deleteItem} from "../controllers/profilController.js";
import {privacyPolicy} from "../controllers/privacyPolicyController.js";

router.get('/', home);

router.get('/administration', admin)
router.get('/administration/users/:id', usersProfil)


router.get('/forum', forum);
router.get('/articles/:id', articlesDetails);
router.get('/add/articles/:id', addArticles);
router.post('/add/articles/:id', addArticlesSubmit);
router.post('/add_comment/:id', addComments);
router.post('/search/articles', searchArticles);


router.get('/auction', auction);
router.get('/add/items/:id', addItems)
router.post('/add/items/:id', addItemsSubmit)
router.post('/search/items', searchItems)


router.get('/login', login);
router.post('/login', loginSubmit);
router.get('/register', register);
router.post('/register', registerSubmit);
router.get('/logout', logOut);
router.get('/profile/:id', profile);
router.delete('/delete/articles/:id', deleteArticle);
router.delete('/delete/items/:id', deleteItem);


router.get('/privacyPolicy', privacyPolicy);


export default router;
