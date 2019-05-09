'use strict';
module.exports = (sequelize, DataTypes) => {
    const cars = sequelize.define('cars', {
        userId: DataTypes.INTEGER,
        mark: DataTypes.STRING,
        power: DataTypes.STRING,
        type: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                cars.belongsTo(models.users, {
                    foreignKey: 'userId',
                    onDelete: 'CASCADE',
                });
            }
        }
    });
    return cars;
};