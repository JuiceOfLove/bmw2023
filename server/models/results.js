import sequelize from "../db.js";
import { DataTypes } from 'sequelize'; 

const Results = sequelize.define('Results', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    test: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    testId: {
        type: DataTypes.INTEGER,  // Adjust the data type based on your requirements
        allowNull: false,
    },
    recipient: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,  // Adjust the data type based on your requirements
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    // Add any other configuration options as needed
});

export default Results;