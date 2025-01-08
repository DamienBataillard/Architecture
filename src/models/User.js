const { DataTypes } = require('sequelize');
const Property = require('./Property');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('investor', 'agent'), // Définition des rôles possibles
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: true,
});

// Un utilisateur (agent) peut gérer plusieurs propriétés
User.hasMany(Property, { foreignKey: 'agent_id', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'agent_id', as: 'agent' });

module.exports = User;
