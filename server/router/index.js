import { Router } from "express";
import * as UserController from '../controllers/UserController.js';
import * as TestController from '../controllers/TestController.js';
import * as PatternController from '../controllers/PatternController.js';
import { body } from 'express-validator';
import authMiddleware from '../middlewares/authMiddleware.js';
import fileUpload from 'express-fileupload';
import ApiError from '../exceptions/apiError.js';

const router = new Router();

router.use(fileUpload());

router.post('/registration',
    body('email').isEmail(),
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
router.get('/users/:id', authMiddleware, UserController.getUserById);
router.post('/users/:id/change-password', authMiddleware, UserController.changePassword);
router.put('/users/:id/avatar', authMiddleware, UserController.updateAvatarUrl);
router.get('/users/:id/avatar', UserController.getAvatarUrl);
router.post('/tests/create', body('test').notEmpty(), body('userId').notEmpty(), TestController.createTest);
router.get('/patterns', PatternController.getPatterns);
router.get('/patterns/:patternId', PatternController.getPatternById);
router.post('/patterns/create', body('pattern').notEmpty(), body('userId').notEmpty(), PatternController.createPattern);
router.get('/tests', TestController.getAllTests);
router.post('/tests/send', authMiddleware, TestController.sendTest);
router.post('/tests/comp', authMiddleware, TestController.sendCompTest);
router.get('/results/:id', TestController.getResultById);
router.get('/tests/pass/:startingLink', TestController.getTestByStartingLink);
router.post('/tests/results', TestController.submitTestResults);
router.get('/results', TestController.getAllResults)

export default router;
