import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/models.js';


export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const { email, fullName, role, avatarUrl, departament } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            email,
            fullName,
            role,
            avatarUrl,
            departament,
            password,
        });

        const token = jwt.sign(
            {
                id: user.id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { password: _, ...userData } = user.toJSON();

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрировать пользователя',
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const isValidPass = await bcrypt.compare(password, user.password);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { password: _, ...userData } = user.toJSON();

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const { password: _, ...userData } = user.toJSON();

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
}
