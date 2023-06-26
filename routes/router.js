import express from "express";


const router = express.Router();

import {home} from '../controllers/homeController.js';
import {privacyPolicy} from "../controllers/privacyPolicyController.js";
import {register, registerSubmit} from '../controllers/registerController.js';
import {login, loginSubmit, logOut} from '../controllers/loginController.js';
import {admin, usersProfil, deleteUser} from '../controllers/adminController.js';

import {
    listArticles,
    articlesDetails,
    addComments,
    addArticles,
    addArticlesSubmit,
    searchArticles,
    editArticle,
    editArticleSubmit
} from '../controllers/forumController.js';
import {
    listItems,
    addItems,
    addItemsSubmit,
    searchItems,
    editItems,
    editItemsSubmit
} from '../controllers/auctionController.js';
import {
    profile,
    deleteArticle,
    deleteItem,
    profilSetting,
    editProfil,
    editProfilSubmit,
    editPassword,
    editPasswordSubmit
} from "../controllers/profilController.js";

router.get('/', home);

router.get('/administration', admin);
router.get('/administration/users/:id', usersProfil);


router.get('/forum', listArticles);
router.get('/articles/:id', articlesDetails);
router.get('/add/articles/:id', addArticles);
router.get('/edit/articles/:id', editArticle);
router.post('/add/articles/:id', addArticlesSubmit);
router.post('/edit/articles/:id', editArticleSubmit);
router.post('/add_comment/:id', addComments);
router.post('/search/articles', searchArticles);


router.get('/auction', listItems);
router.get('/add/items/:id', addItems);
router.get('/edit/items/:id', editItems);
router.post('/add/items/:id', addItemsSubmit);
router.post('/edit/items/:id', editItemsSubmit);
router.post('/search/items', searchItems);


router.get('/login', login);
router.get('/register', register);
router.get('/logout', logOut);
router.get('/profile/:id', profile);
router.get('/setting/profile/:id', profilSetting);
router.get('/setting/edit-profile/:id', editProfil);
router.get('/setting/edit-password/:id', editPassword);
router.post('/login', loginSubmit);
router.post('/register', registerSubmit);
router.post('/setting/edit-profile/:id', editProfilSubmit);
router.post('/setting/edit-password/:id', editPasswordSubmit);
router.delete('/delete/articles/:id', deleteArticle);
router.delete('/delete/items/:id', deleteItem);
router.delete('/delete/users/:id', deleteUser);


router.get('/privacyPolicy', privacyPolicy);


export default router;
