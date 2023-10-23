import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './router/index.js'

import sequelize from './db.js';

const PORT = process.env.PORT || 4444;
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, (err) => {
            if(err) {
                return console.log(err);
            }

            console.log("Server OK")
        });

    } catch (err) {}
}

start()