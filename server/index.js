import 'dotenv/config';
import express from 'express';
import { registerValidation, loginValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';

import sequelize from './db.js';

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(4444, (err) => {
            if(err) {
                return console.log(err);
            }

            console.log("Server OK")
        });

    } catch (err) {}
}

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

start()