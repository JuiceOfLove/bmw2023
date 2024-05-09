import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import User from './models.js'

const Test = sequelize.define('Test', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    test: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
});

Test.belongsTo(User, { foreignKey: 'userId' });

export default Test;
