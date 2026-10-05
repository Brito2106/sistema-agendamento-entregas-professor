const express = require('express');
const router = express.Router();

const { ItemEntrega, Entrega } = require('../models');

// LISTAR TODOS OS ITENS
router.get('/', async (req, res) => {
    try {
        const itens = await ItemEntrega.findAll();

        res.json(itens);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar itens da entrega'
        });
    }
});

// LISTAR ITENS DE UMA ENTREGA
router.get('/entrega/:id_entrega', async (req, res) => {
    try {
        const itens = await ItemEntrega.findAll({
            where: {
                id_entrega: req.params.id_entrega
            }
        });

        res.json({
            id_entrega: Number(req.params.id_entrega),
            total_itens: itens.length,
            itens: itens
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar itens da entrega'
        });
    }
});

// BUSCAR ITEM POR ID
router.get('/:id', async (req, res) => {
    try {
        const item = await ItemEntrega.findByPk(req.params.id);

        if (!item) {
            return res.status(404).json({
                erro: 'Item não encontrado'
            });
        }

        res.json(item);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar item'
        });
    }
});

// CADASTRAR ITEM
router.post('/', async (req, res) => {
    try {
        const { id_entrega, quantidade } = req.body;

        // Verificar se a quantidade é válida
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return res.status(400).json({
                erro: 'A quantidade deve ser um número inteiro maior que zero'
            });
        }


        // Verificar se a entrega existe
        const entrega = await Entrega.findByPk(id_entrega);

        if (!entrega) {
            return res.status(404).json({
                erro: 'Entrega não encontrada'
            });
        }

        const item = await ItemEntrega.create(req.body);

        res.status(201).json(item);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar item'
        });
    }
});

// ATUALIZAR ITEM
router.put('/:id', async (req, res) => {
    try {
        const item = await ItemEntrega.findByPk(req.params.id);

        if (!item) {
            return res.status(404).json({
                erro: 'Item não encontrado'
            });
        }

        // Verificar se a quantidade é válida
        if (
            req.body.quantidade !== undefined &&
            (!Number.isInteger(req.body.quantidade) || req.body.quantidade <= 0)
        ) {
            return res.status(400).json({
                erro: 'A quantidade deve ser um número inteiro maior que zero'
            });
        }

        // Se estiver alterando a entrega, verificar se ela existe
        if (req.body.id_entrega) {
            const entrega = await Entrega.findByPk(req.body.id_entrega);

            if (!entrega) {
                return res.status(404).json({
                    erro: 'Entrega não encontrada'
                });
            }
        }

        await item.update(req.body);

        res.json(item);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar item'
        });
    }
});

// EXCLUIR ITEM
router.delete('/:id', async (req, res) => {
    try {
        const item = await ItemEntrega.findByPk(req.params.id);

        if (!item) {
            return res.status(404).json({
                erro: 'Item não encontrado'
            });
        }

        await item.destroy();

        res.json({
            mensagem: 'Item excluído com sucesso'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir item'
        });
    }
});

module.exports = router;