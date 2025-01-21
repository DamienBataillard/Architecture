const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RentalIncome = sequelize.define('RentalIncome', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'rental_incomes',
    timestamps: true,
});

module.exports = RentalIncome;
