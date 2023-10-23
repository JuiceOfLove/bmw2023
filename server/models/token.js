import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import User from './models.js'

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Token.belongsTo(User, { foreignKey: 'userId' });

export default Token;
