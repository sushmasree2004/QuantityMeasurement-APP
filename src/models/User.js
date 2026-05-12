const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');



const User = sequelize.define('User', {

    id: {
        type          : DataTypes.BIGINT,
        autoIncrement : true,
        primaryKey    : true,
    },

    name: {
        type      : DataTypes.STRING,
        allowNull : false,
    },

    email: {
        type      : DataTypes.STRING,
        allowNull : false,
        unique    : true,   // no two users with same email
    },

    password: {
        type      : DataTypes.STRING,
        allowNull : false,
        // NOTE: we NEVER store plain password here
        // bcrypt hashed password is stored
    },

    role: {
        type         : DataTypes.ENUM('user', 'admin'),
        defaultValue : 'user',
        // for Authorization middleware later
    }

}, {
    tableName  : 'users',
    timestamps : true,   
});

module.exports = User;
