import { body } from 'express-validator';

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 3 }),
    body('role').isLength({ min: 3 }),
    body('avatarUrl').isLength({ min: 3 }),
    body('departament').isLength({ min: 3 }),
];