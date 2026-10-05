const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entregador = sequelize.define('Entregador', {
    id_entregador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    telefone: {
        type: DataTypes.STRING(20)
    },

    disponibilidade: {
        type: DataTypes.STRING(100)
    },

    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'entregadores',
    timestamps: false
});

module.exports = Entregador;