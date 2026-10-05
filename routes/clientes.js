const express = require('express');
const router = express.Router();

const { Cliente } = require('../models');

// LISTAR TODOS OS CLIENTES
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.findAll();

        res.json(clientes);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar clientes'
        });
    }
});

// BUSCAR CLIENTE POR ID
router.get('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                erro: 'Cliente não encontrado'
            });
        }

        res.json(cliente);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar cliente'
        });
    }
});

// CADASTRAR CLIENTE
router.post('/', async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body);

        res.status(201).json(cliente);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar cliente'
        });
    }
});

// ATUALIZAR CLIENTE
router.put('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                erro: 'Cliente não encontrado'
            });
        }

        await cliente.update(req.body);

        res.json(cliente);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar cliente'
        });
    }
});

// EXCLUIR CLIENTE
router.delete('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                erro: 'Cliente não encontrado'
            });
        }

        await cliente.destroy();

        res.json({
            mensagem: 'Cliente excluído com sucesso'
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir cliente'
        });
    }
});

module.exports = router;