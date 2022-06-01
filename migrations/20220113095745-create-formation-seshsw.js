'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Formation-seshsw', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            attachment: {
                type: Sequelize.STRING
            },
            titleFirst: {
                type: Sequelize.STRING
            },
            titleSecond: {
                type: Sequelize.STRING
            },
            niveau: {
                type: Sequelize.STRING
            },
            duration: {
                type: Sequelize.STRING
            },
            href: {
                type: Sequelize.STRING
            },
            isActive: {
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
        await queryInterface.dropTable('Formation-seshsw');
    }
};