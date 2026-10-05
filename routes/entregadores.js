const express = require('express');
const router = express.Router();

const { Entregador } = require('../models');

// LISTAR TODOS OS ENTREGADORES
router.get('/', async (req, res) => {
    try {
        const entregadores = await Entregador.findAll();

        res.json(entregadores);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar entregadores'
        });
    }
});

// BUSCAR ENTREGADOR POR ID
router.get('/:id', async (req, res) => {
    try {
        const entregador = await Entregador.findByPk(req.params.id);

        if (!entregador) {
            return res.status(404).json({
                erro: 'Entregador não encontrado'
            });
        }

        res.json(entregador);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar entregador'
        });
    }
});

// CADASTRAR ENTREGADOR
router.post('/', async (req, res) => {
    try {
        const entregador = await Entregador.create(req.body);

        res.status(201).json(entregador);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar entregador'
        });
    }
});

// ATUALIZAR ENTREGADOR
router.put('/:id', async (req, res) => {
    try {
        const entregador = await Entregador.findByPk(req.params.id);

        if (!entregador) {
            return res.status(404).json({
                erro: 'Entregador não encontrado'
            });
        }

        await entregador.update(req.body);

        res.json(entregador);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar entregador'
        });
    }
});

// EXCLUIR ENTREGADOR
router.delete('/:id', async (req, res) => {
    try {
        const entregador = await Entregador.findByPk(req.params.id);

        if (!entregador) {
            return res.status(404).json({
                erro: 'Entregador não encontrado'
            });
        }

        await entregador.destroy();

        res.json({
            mensagem: 'Entregador excluído com sucesso'
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir entregador'
        });
    }
});

module.exports = router;