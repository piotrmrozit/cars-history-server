'use strict';
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        username: {
            type:DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type:DataTypes.STRING,
            allowNull: false
        },
        token: {
            type:DataTypes.STRING
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        gender: {
            type: DataTypes.STRING
        },
        birthday: {
            type: DataTypes.DATE
        }
    }, {
        classMethods: {
            associate: function (models) {
                users.hasMany(models.cars, {
                    foreignKey: 'userId',
                    as: 'userId',
                });
            }
        }
    });
    return users;
};