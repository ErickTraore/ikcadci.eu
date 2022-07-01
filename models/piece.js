'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Piece extends Model {
        static associate(models) {
            models.Piece.belongsTo(models.User, {
                foreignKey: {
                    allowNull: false
                }
            })
        }
    }
    Piece.init({
        title: DataTypes.STRING,
        attachment: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Piece',
    });
    return Piece;
};