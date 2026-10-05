const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemEntrega = sequelize.define('ItemEntrega', {
    id_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_entrega: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    produto: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'itens_entrega',
    timestamps: false
});

module.exports = ItemEntrega;