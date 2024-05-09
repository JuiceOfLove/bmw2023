import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import User from './models.js'
import Test from "./test.js";

const Sended = sequelize.define('Sended', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    test: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    recipientName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    recipientEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startingLink: {
        type: DataTypes.STRING,
    },
    duration:{
        type: DataTypes.STRING,
    },
    started:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
});

Sended.belongsTo(User, { foreignKey: 'userId' });
Sended.belongsTo(Test, { foreignKey: 'testId' }); // Add association with the Test model

export default Sended;
