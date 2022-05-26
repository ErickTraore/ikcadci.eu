'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Inscription extends Model {
        static associate(models) {}
    }
    Inscription.init({
        email: DataTypes.STRING,
        idEtudiant: DataTypes.INTEGER,
        idAdmin: DataTypes.INTEGER,
        content: DataTypes.STRING,
        refFormation: DataTypes.STRING,
        dateExpire: DataTypes.STRING,
        activeInscription: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Inscription',
    });
    return Inscription;
};