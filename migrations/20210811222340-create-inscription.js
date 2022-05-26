'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Inscriptions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                allowNull: true,
                type: Sequelize.STRING
            },
            idEtudiant: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            idAdmin: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            content: {
                allowNull: true,
                type: Sequelize.STRING
            },
            refFormation: {
                allowNull: true,
                type: Sequelize.STRING
            },
            dateExpire: {
                allowNull: true,
                type: Sequelize.DATE
            },

            activeInscription: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
            },
            createdAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('Inscriptions');
    }
};