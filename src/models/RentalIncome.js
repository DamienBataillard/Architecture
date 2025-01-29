const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RentalIncome = sequelize.define(
    "RentalIncome",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        property_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "properties", key: "id" }, // Foreign key
            onDelete: "CASCADE",
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" }, // Foreign key
            onDelete: "CASCADE",
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "rental_income",
        timestamps: true,
    }
);

module.exports = RentalIncome;
