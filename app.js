require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const clientesRoutes = require('./routes/clientes');
const entregadoresRoutes = require('./routes/entregadores');
const entregasRoutes = require('./routes/entregas');
const itensEntregaRoutes = require('./routes/itensEntrega');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/clientes', clientesRoutes);
app.use('/entregadores', entregadoresRoutes);
app.use('/entregas', entregasRoutes);
app.use('/itens-entrega', itensEntregaRoutes);

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Sistema de Agendamento de Entregas funcionando!'
    });
});

sequelize.authenticate()
    .then(() => {
        console.log('Banco de dados conectado com sucesso!');

        app.listen(3000, () => {
            console.log('Servidor rodando em http://localhost:3000');
        });
    })
    .catch((erro) => {
        console.error('Erro ao conectar ao banco:', erro);
    });