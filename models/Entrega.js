const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entrega = sequelize.define('Entrega', {
    id_entrega: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_entregador: {
        type: DataTypes.INTEGER
    },

    data_entrega: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },

    hora_fim: {
        type: DataTypes.TIME,
        allowNull: false
    },

    endereco_entrega: {
        type: DataTypes.STRING(200),
        allowNull: false
    },

    descricao: {
        type: DataTypes.TEXT
    },

    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'Agendada'
    },

    observacao: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'entregas',
    timestamps: false
});

module.exports = Entrega;