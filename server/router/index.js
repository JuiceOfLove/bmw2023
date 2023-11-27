import { Router } from "express";
import * as UserController from '../controllers/UserController.js';
import {body} from 'express-validator';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 3 }),
    body('role').isLength({ min: 3 }),
    body('departament').isLength({ min: 2 }),
    body('avatarUrl').isLength({ min: 3 }),
    UserController.registration
);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);
router.get('/users', authMiddleware, UserController.getUsers);

export default router;
