'use strict';
module.exports = (sequelize, DataTypes) => {
    const users_photo = sequelize.define('users_photo', {
        userId: {
            type:DataTypes.INTEGER,
            allowNull: false
        },
        photoUrl: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                users.hasMany(models.users_photo, {
                    foreignKey: 'userId',
                    as: 'userId',
                });
            }
        }
    });
    return users_photo;
};