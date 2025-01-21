const { DataTypes } = require('sequelize');
const Investment = require('./Investment');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'open', 'funded'),
        defaultValue: 'pending',
    },
    type: {
        type: DataTypes.ENUM('apartment', 'building'),
        allowNull: false,
    },
    agent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'properties',
    timestamps: true,
});

Property.hasMany(Investment, { foreignKey: 'property_id', as: 'investments' });
Investment.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });

module.exports = Property;
