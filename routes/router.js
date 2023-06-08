import express from "express";
const router = express.Router();

import {home} from '../controllers/homeController.js';
import {forum, articlesDetails, addComments} from '../controllers/forumController.js';
import {auction} from '../controllers/auctionController.js';
import {login, loginSubmit} from '../controllers/loginController.js';
import {register, registerSubmit} from '../controllers/registerController.js';

router.get('/', home);
router.get('/forum', forum);
router.get('/articles/:id', articlesDetails);
router.post('/add_comment/:id', addComments)
router.get('/auction', auction);
router.get('/login', login);
router.post('/login', loginSubmit);
router.get('/register', register);
router.post('/register', registerSubmit);


export default router;
