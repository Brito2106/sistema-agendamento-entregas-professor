const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
    id_cliente: {
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

    endereco: {
        type: DataTypes.STRING(150),
        allowNull: false
    },

    numero: {
        type: DataTypes.STRING(10)
    },

    bairro: {
        type: DataTypes.STRING(100)
    },

    cidade: {
        type: DataTypes.STRING(100)
    },

    observacao: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'clientes',
    timestamps: false
});

module.exports = Cliente;