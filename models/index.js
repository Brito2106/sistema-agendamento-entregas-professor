const Cliente = require('./Cliente');
const Entregador = require('./Entregador');
const Entrega = require('./Entrega');
const ItemEntrega = require('./ItemEntrega');

// Cliente 1:N Entrega
Cliente.hasMany(Entrega, {
    foreignKey: 'id_cliente'
});

Entrega.belongsTo(Cliente, {
    foreignKey: 'id_cliente'
});

// Entregador 1:N Entrega
Entregador.hasMany(Entrega, {
    foreignKey: 'id_entregador'
});

Entrega.belongsTo(Entregador, {
    foreignKey: 'id_entregador'
});

// Entrega 1:N ItemEntrega
Entrega.hasMany(ItemEntrega, {
    foreignKey: 'id_entrega'
});

ItemEntrega.belongsTo(Entrega, {
    foreignKey: 'id_entrega'
});

module.exports = {
    Cliente,
    Entregador,
    Entrega,
    ItemEntrega
};