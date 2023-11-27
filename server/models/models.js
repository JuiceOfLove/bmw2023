import sequelize from "../db.js";
import { DataTypes } from "sequelize";


const User = sequelize.define('User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'member',
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        departament: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatarUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActivated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        activationLink: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
        modelName: 'User',
        tableName: 'users',
    }
);

export default User;