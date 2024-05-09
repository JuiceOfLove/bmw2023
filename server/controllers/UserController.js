import { validationResult } from 'express-validator';
import UserService from '../service/userService.js';
import ApiError from '../exceptions/apiError.js';

export const registration = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Ошибки валидации:', errors.array());
            return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
        }
        const { email, role, fullName, departament, avatarUrl } = req.body;
        await UserService.registration(email, fullName, departament, role, avatarUrl);
        // return res.json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (e) {
        next(e);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await UserService.login(email, password);
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData);
    } catch (e) {
        next(e);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await UserService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.json(token);
    } catch (e) {
        next(e);
    }
};

export const activate = async (req, res, next) => {
    try {
        const activationLink = req.params.link;
        await UserService.activate(activationLink);
        return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
        next(e);
    }
};

export const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = await UserService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData);
    } catch (e) {
        next(e);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers();
        return res.json(users);
    } catch (e) {
        next(e);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserService.getUserById(id);

        return res.json(user);
    } catch (e) {
        next(e);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await UserService.getUserById(id);

        const isOldPasswordCorrect = await UserService.comparePasswords(oldPassword, user.password);

        if (!isOldPasswordCorrect) {
            throw ApiError.BadRequest('Неверный старый пароль');
        }

        await UserService.updateUserPassword(id, newPassword);

        return res.json({ message: 'Пароль успешно изменен' });
    } catch (e) {
        next(e);
    }
};

export const getAvatarUrl = async (req, res, next) => {
    try {
        const { id } = req.params;
        const avatarUrl = await UserService.getAvatarUrl(id);

        if (!avatarUrl) {
            return res.status(404).json({ error: 'Avatar not found' });
        }

        // Возвращаем URL аватара в ответе
        return res.json({ avatarUrl });
    } catch (e) {
        next(e);
    }
};

export const updateAvatarUrl = async (req, res, next) => {
    try {
        // Check if the request has files
        if (!req.files || Object.keys(req.files).length === 0) {
            throw ApiError.BadRequest('No file uploaded');
        }

        const { id } = req.params;
        const { avatar } = req.files;

        // Assuming 'avatar' is the name attribute in your form for the file input

        const avatarUrl = `/uploads/avatars/${avatar.name}`;

        // Move the file to the desired location (create the 'uploads/avatars' directory if not exists)
        await avatar.mv(`uploads/avatars/${avatar.name}`);

        await UserService.updateAvatarUrl(id, avatarUrl);

        return res.json({ message: 'Avatar URL updated successfully' });
    } catch (e) {
        next(e);
    }
};

