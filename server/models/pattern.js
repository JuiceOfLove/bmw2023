import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import User from './models.js'

const Pattern = sequelize.define('Pattern', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pattern: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
});

Pattern.belongsTo(User, { foreignKey: 'userId' });

export default Pattern;
