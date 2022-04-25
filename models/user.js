'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            models.User.hasMany(models.Message)
        }
    }
    User.init({
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        lastname: DataTypes.STRING,
        password: DataTypes.STRING,
        biographie: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN,
        usernameTradition: DataTypes.STRING,
        lastnameTradition: DataTypes.STRING,
        dateBirthday: DataTypes.STRING,
        townBirthday: DataTypes.STRING,
        sexe: DataTypes.STRING,
        nationalite: DataTypes.STRING,
        adresseResid: DataTypes.STRING,
        villeResid: DataTypes.STRING,
        paysResid: DataTypes.STRING,
        tel1: DataTypes.STRING,
        tel2: DataTypes.STRING,
        tel3: DataTypes.STRING,
        picked: DataTypes.STRING,
        profession: DataTypes.STRING,
        activite: DataTypes.STRING,
        seshsw: DataTypes.STRING,
        seshswNsw: DataTypes.STRING,
        seba: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};