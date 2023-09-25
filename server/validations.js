import { body } from 'express-validator';

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 3 }),
    body('role').isLength({ min: 3 }),
    body('avatarUrl').optional().isURL(),
    body('departament').isLength({ min: 3 }),
];