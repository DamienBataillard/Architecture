const { DataTypes } = require('sequelize');
const Property = require('./Property');
const Wallet = require('./Wallet');
const Investment = require('./Investment');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

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
        type: DataTypes.ENUM('investor', 'agent'),
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
});

User.hasMany(Property, { foreignKey: 'agent_id', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'agent_id', as: 'agent' });
User.hasOne(Wallet, { foreignKey: 'user_id', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Investment, { foreignKey: 'user_id', as: 'investments' });
Investment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = User;
