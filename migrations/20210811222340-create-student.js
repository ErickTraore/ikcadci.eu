'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Students', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: "id"
                }
            },
            email: {
                allowNull: true,
                type: Sequelize.STRING
            },
            username: {
                allowNull: true,
                type: Sequelize.STRING
            },

            lastname: {
                allowNull: true,
                type: Sequelize.STRING
            },
            usernameTradition: {
                allowNull: true,
                type: Sequelize.STRING
            },
            lastnameTradition: {
                allowNull: true,
                type: Sequelize.STRING
            },
            dateBirthday: {
                allowNull: true,
                type: Sequelize.STRING
            },
            townBirthday: {
                allowNull: true,
                type: Sequelize.STRING
            },
            sexe: {
                allowNull: true,
                type: Sequelize.STRING
            },
            nationalite: {
                allowNull: true,
                type: Sequelize.STRING
            },
            adresseResid: {
                allowNull: true,
                type: Sequelize.STRING
            },
            villeResid: {
                allowNull: true,
                type: Sequelize.STRING
            },
            paysResid: {
                allowNull: true,
                type: Sequelize.STRING
            },
            tel1: {
                allowNull: true,
                type: Sequelize.STRING
            },
            tel2: {
                allowNull: true,
                type: Sequelize.STRING
            },
            tel3: {
                allowNull: true,
                type: Sequelize.STRING
            },
            picked: {
                allowNull: true,
                type: Sequelize.STRING
            },
            profession: {
                allowNull: true,
                type: Sequelize.STRING
            },
            activite: {
                allowNull: true,
                type: Sequelize.STRING
            },
            seshsw: {
                allowNull: true,
                type: Sequelize.STRING
            },
            seshswNsw: {
                allowNull: true,
                type: Sequelize.STRING
            },
            seba: {
                allowNull: true,
                type: Sequelize.STRING
            },

            acceptOne: {
                allowNull: true,
                type: Sequelize.BOOLEAN
            },
            acceptTwo: {
                allowNull: true,
                type: Sequelize.BOOLEAN
            },
            isAdmin: {
                allowNull: true,
                type: Sequelize.BOOLEAN
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('Students');
    }
};