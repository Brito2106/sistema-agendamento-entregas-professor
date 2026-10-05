const express = require('express');
const router = express.Router();

const { Entrega, Entregador, Cliente } = require('../models');
const { Op } = require('sequelize');

function horarioDisponivel(disponibilidade, horaInicio, horaFim) {
    if (!disponibilidade) {
        return true;
    }

    const partes = disponibilidade.split(' às ');

    if (partes.length !== 2) {
        return true;
    }

    const inicioDisponibilidade = partes[0];
    const fimDisponibilidade = partes[1];

    function converterParaMinutos(horario) {
        const [hora, minuto] = horario.substring(0, 5).split(':');

        return Number(hora) * 60 + Number(minuto);
    }

    const inicio = converterParaMinutos(horaInicio);
    const fim = converterParaMinutos(horaFim);

    const inicioDisponivel = converterParaMinutos(inicioDisponibilidade);
    const fimDisponivel = converterParaMinutos(fimDisponibilidade);

    return (
        inicio >= inicioDisponivel &&
        fim <= fimDisponivel
    );
}

// LISTAR TODAS AS ENTREGAS OU FILTRAR POR DATA
router.get('/', async (req, res) => {
    try {
        const { Cliente, Entregador, ItemEntrega } = require('../models');

        const { data, id_entregador } = req.query;

        const where = {};

        if (data) {
            where.data_entrega = data;
        }

        if (id_entregador) {
            where.id_entregador = id_entregador;
        }

        const entregas = await Entrega.findAll({
            where: where,
            include: [
                {
                    model: Cliente
                },
                {
                    model: Entregador
                },
                {
                    model: ItemEntrega
                }
            ],
            order: [
                ['data_entrega', 'ASC'],
                ['hora_inicio', 'ASC']
            ]
        });

        res.json(entregas);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar entregas',
            detalhes: erro.message
        });
    }
});

// LISTAR HORÁRIOS DISPONÍVEIS
router.get('/disponiveis', async (req, res) => {
    try {
        const { data, id_entregador } = req.query;

        if (!data || !id_entregador) {
            return res.status(400).json({
                erro: 'Informe a data e o id do entregador'
            });
        }

        const entregador = await Entregador.findByPk(id_entregador);

        if (!entregador) {
            return res.status(404).json({
                erro: 'Entregador não encontrado'
            });
        }

        if (!entregador.ativo) {
            return res.status(400).json({
                erro: 'O entregador está inativo'
            });
        }

        const entregas = await Entrega.findAll({
            where: {
                data_entrega: data,
                id_entregador: id_entregador
            },
            include: [
                {
                    model: Cliente
                },
                {
                    model: require('../models').ItemEntrega
                }
            ],
            order: [['hora_inicio', 'ASC']]
        });

        const partes = entregador.disponibilidade.split(' às ');

        const horaInicioDisponibilidade = parseInt(
            partes[0].split(':')[0]
        );

        const horaFimDisponibilidade = parseInt(
            partes[1].split(':')[0]
        );

        const horarios = [];

        for (
            let hora = horaInicioDisponibilidade;
            hora < horaFimDisponibilidade;
            hora++
        ) {
            const inicio = `${String(hora).padStart(2, '0')}:00:00`;
            const fim = `${String(hora + 1).padStart(2, '0')}:00:00`;

            const entrega = entregas.find((entrega) => {
                return (
                    inicio < entrega.hora_fim &&
                    fim > entrega.hora_inicio
                );
            });

            if (entrega) {
                horarios.push({
                    hora_inicio: inicio,
                    hora_fim: fim,
                    status: 'Agendado',
                    entrega: {
                        id_entrega: entrega.id_entrega,
                        cliente: entrega.Cliente,
                        endereco_entrega: entrega.endereco_entrega,
                        descricao: entrega.descricao,
                        observacao: entrega.observacao,
                        itens: entrega.ItemEntregas
                    }
                });
            } else {
                horarios.push({
                    hora_inicio: inicio,
                    hora_fim: fim,
                    status: 'Livre',
                    entrega: null
                });
            }
        }

        const manha = horarios.filter((horario) => {
            return parseInt(horario.hora_inicio.substring(0, 2)) < 12;
        });

        const tarde = horarios.filter((horario) => {
            return parseInt(horario.hora_inicio.substring(0, 2)) >= 12;
        });

        res.json({
            data: data,
            id_entregador: Number(id_entregador),
            manha: manha,
            tarde: tarde
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar horários disponíveis'
        });
    }
});

// CONSULTAR AGENDA DO DIA
router.get('/agenda', async (req, res) => {
    try {
        const { data } = req.query;

        if (!data) {
            return res.status(400).json({
                erro: 'Informe a data'
            });
        }

        const { Cliente, Entregador, ItemEntrega } = require('../models');

        const entregas = await Entrega.findAll({
            where: {
                data_entrega: data
            },
            include: [
                {
                    model: Cliente
                },
                {
                    model: Entregador
                },
                {
                    model: ItemEntrega
                }
            ],
            order: [
                ['hora_inicio', 'ASC']
            ]
        });

        const agenda = entregas.map((entrega) => {
            return {
                id_entrega: entrega.id_entrega,

                horario: {
                    inicio: entrega.hora_inicio,
                    fim: entrega.hora_fim
                },

                cliente: entrega.Cliente
                    ? entrega.Cliente.nome
                    : 'Cliente não informado',

                endereco: entrega.endereco_entrega,

                entregador: entrega.Entregador
                    ? entrega.Entregador.nome
                    : 'Entregador não informado',

                status: entrega.status,

                descricao: entrega.descricao,

                observacao: entrega.observacao,

                produtos: entrega.ItemEntregas
                    ? entrega.ItemEntregas.map((item) => ({
                        produto: item.produto,
                        quantidade: item.quantidade
                    }))
                    : []
            };
        });

        res.json({
            data: data,
            total_entregas: agenda.length,
            agenda: agenda
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar agenda'
        });
    }
});

// ATUALIZAR STATUS DA ENTREGA
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        const statusPermitidos = [
            'Agendada',
            'Em andamento',
            'Concluída',
            'Cancelada'
        ];

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                erro: 'Status inválido',
                status_permitidos: statusPermitidos
            });
        }

        const entrega = await Entrega.findByPk(req.params.id);

        if (!entrega) {
            return res.status(404).json({
                erro: 'Entrega não encontrada'
            });
        }

        await entrega.update({
            status: status
        });

        res.json({
            mensagem: 'Status atualizado com sucesso',
            entrega: entrega
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar status da entrega'
        });
    }
});

// CANCELAR ENTREGA
router.put('/:id/cancelar', async (req, res) => {
    try {
        const entrega = await Entrega.findByPk(req.params.id);

        if (!entrega) {
            return res.status(404).json({
                erro: 'Entrega não encontrada'
            });
        }

        // Não permitir cancelar uma entrega já concluída
        if (entrega.status === 'Concluída') {
            return res.status(400).json({
                erro: 'Não é possível cancelar uma entrega concluída'
            });
        }

        // Não permitir cancelar uma entrega que já foi cancelada
        if (entrega.status === 'Cancelada') {
            return res.status(400).json({
                erro: 'A entrega já está cancelada'
            });
        }

        await entrega.update({
            status: 'Cancelada'
        });

        res.json({
            mensagem: 'Entrega cancelada com sucesso',
            entrega: entrega
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cancelar entrega'
        });
    }
});

// GET /entregas/mesma-rota
router.get('/mesma-rota', async (req, res) => {
    try {
        const { id_cliente, data, id_entregador } = req.query;

        if (!id_cliente || !data || !id_entregador) {
            return res.status(400).json({
                erro: 'Informe o cliente, a data e o entregador'
            });
        }

        const cliente = await Cliente.findByPk(id_cliente);

        if (!cliente) {
            return res.status(404).json({
                erro: 'Cliente não encontrado'
            });
        }

        const entregas = await Entrega.findAll({
            where: {
                data_entrega: data,
                id_entregador: id_entregador,
                status: {
                    [Op.notIn]: ['Concluída', 'Cancelada']
                }
            },
            include: [
                {
                    model: Cliente
                },
                {
                    model: require('../models').ItemEntrega
                }
            ],
            order: [['hora_inicio', 'ASC']]
        });

        const mesmasRotas = entregas.filter((entrega) => {
            if (!entrega.Cliente) {
                return false;
            }

            return (
                entrega.Cliente.cidade === cliente.cidade &&
                entrega.Cliente.bairro === cliente.bairro
            );
        });

        res.json({
            cliente: {
                id_cliente: cliente.id_cliente,
                nome: cliente.nome,
                bairro: cliente.bairro,
                cidade: cliente.cidade
            },
            mesma_rota: mesmasRotas
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao verificar mesma rota'
        });
    }
});

// GET /entregas/sugerir-rota
router.get('/sugerir-rota', async (req, res) => {
    try {
        const { id_entrega } = req.query;

        if (!id_entrega) {
            return res.status(400).json({
                erro: 'Informe o id da entrega'
            });
        }

        const entrega = await Entrega.findByPk(id_entrega);

        if (!entrega) {
            return res.status(404).json({
                erro: 'Entrega não encontrada'
            });
        }

        const entregador = await Entregador.findByPk(
            entrega.id_entregador
        );

        if (!entregador) {
            return res.status(404).json({
                erro: 'Entregador não encontrado'
            });
        }

        if (!entregador.ativo) {
            return res.status(400).json({
                erro: 'O entregador está inativo'
            });
        }

        // Pega todos os horários já ocupados pelo entregador
        const entregasDoDia = await Entrega.findAll({
            where: {
                id_entregador: entrega.id_entregador,
                data_entrega: entrega.data_entrega
            }
        });

        // Horário da entrega de referência
        const inicio = parseInt(
            entrega.hora_inicio.substring(0, 2)
        );

        const fim = parseInt(
            entrega.hora_fim.substring(0, 2)
        );

        const candidatos = [];

        // Horário anterior
        candidatos.push({
            hora_inicio: `${String(inicio - 1).padStart(2, '0')}:00:00`,
            hora_fim: `${String(inicio).padStart(2, '0')}:00:00`
        });

        // Horário posterior
        candidatos.push({
            hora_inicio: `${String(fim).padStart(2, '0')}:00:00`,
            hora_fim: `${String(fim + 1).padStart(2, '0')}:00:00`
        });

        const horariosSugeridos = [];

        for (const candidato of candidatos) {

            // Verifica disponibilidade do entregador
            const dentroDaDisponibilidade = horarioDisponivel(
                entregador.disponibilidade,
                candidato.hora_inicio,
                candidato.hora_fim
            );

            if (!dentroDaDisponibilidade) {
                continue;
            }

            // Verifica conflito com outras entregas
            const conflito = entregasDoDia.some(
                (entregaExistente) => {

                    // Ignora a própria entrega de referência
                    if (
                        entregaExistente.id_entrega ===
                        entrega.id_entrega
                    ) {
                        return false;
                    }

                    return (
                        candidato.hora_inicio <
                            entregaExistente.hora_fim &&
                        candidato.hora_fim >
                            entregaExistente.hora_inicio
                    );
                }
            );

            if (!conflito) {
                horariosSugeridos.push(candidato);
            }
        }

        res.json({
            entrega_referencia: {
                id_entrega: entrega.id_entrega,
                data_entrega: entrega.data_entrega,
                hora_inicio: entrega.hora_inicio,
                hora_fim: entrega.hora_fim,
                endereco: entrega.endereco_entrega
            },
            horarios_sugeridos: horariosSugeridos
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao sugerir horários para a mesma rota'
        });
    }
});

// BUSCAR ENTREGA COMPLETA POR ID
router.get('/:id', async (req, res) => {
    try {
        const { Cliente, Entregador, ItemEntrega } = require('../models');

        const entrega = await Entrega.findByPk(req.params.id, {
            include: [
                {
                    model: Cliente
                },
                {
                    model: Entregador
                },
                {
                    model: ItemEntrega
                }
            ]
        });

        if (!entrega) {
            return res.status(404).json({
                erro: 'Entrega não encontrada'
            });
        }

        res.json(entrega);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar entrega'
        });
    }
});

// CADASTRAR ENTREGA
router.post('/', async (req, res) => {
    try {
        const {
            id_entregador,
            data_entrega,
            hora_inicio,
            hora_fim
        } = req.body;

        // Verificar campos obrigatórios
        if (
            !req.body.id_cliente ||
            !data_entrega ||
            !hora_inicio ||
            !hora_fim ||
            !req.body.endereco_entrega
        ) {
            return res.status(400).json({
                erro: 'Informe o cliente, data, horário de início, horário de fim e endereço da entrega'
            });
        }

        // Verificar se o cliente existe
        const cliente = await Cliente.findByPk(req.body.id_cliente);

        if (!cliente) {
            return res.status(404).json({
                erro: 'Cliente não encontrado'
            });
        }

        // Verificar se o horário da entrega é válido
        if (hora_inicio >= hora_fim) {
            return res.status(400).json({
                erro: 'O horário de início deve ser menor que o horário de fim'
            });
        }

        // Verificar se o entregador já possui uma entrega no mesmo horário
        const entregasDoDia = await Entrega.findAll({
            where: {
                id_entregador: id_entregador,
                data_entrega: data_entrega
            }
        });

        for (const entregaExistente of entregasDoDia) {

            const inicioNova = hora_inicio;
            const fimNova = hora_fim;

            const inicioExistente = entregaExistente.hora_inicio;
            const fimExistente = entregaExistente.hora_fim;

            if (
                inicioNova < fimExistente &&
                fimNova > inicioExistente
            ) {
                return res.status(400).json({
                    erro: 'O entregador já possui uma entrega nesse horário'
                });
            }
        }

        // Verificar se o entregador já possui uma entrega no mesmo horário
        const conflito = await Entrega.findAll({
            where: {
                id_entregador: id_entregador,
                data_entrega: data_entrega
            }
        });

        if (conflito) {
            const inicioNova = hora_inicio;
            const fimNova = hora_fim;

            const inicioExistente = conflito.hora_inicio;
            const fimExistente = conflito.hora_fim;

            if (
                inicioNova < fimExistente &&
                fimNova > inicioExistente
            ) {
                return res.status(400).json({
                    erro: 'O entregador já possui uma entrega nesse horário'
                });
            }
        }

        // Cadastrar a entrega
        const entrega = await Entrega.create(req.body);
        res.status(201).json(entrega);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar entrega'
        });
    }
});


// ATUALIZAR ENTREGA
router.put('/:id', async (req, res) => {
    try {
        const entrega = await Entrega.findByPk(req.params.id);

        if (!entrega) {
            return res.status(404).json({
                erro: 'Entrega não encontrada'
            });
        }

        const {
            id_cliente,
            id_entregador,
            data_entrega,
            hora_inicio,
            hora_fim,
            endereco_entrega
        } = req.body;

        const clienteId = id_cliente ?? entrega.id_cliente;
        const entregadorId = id_entregador ?? entrega.id_entregador;
        const data = data_entrega ?? entrega.data_entrega;
        const inicio = hora_inicio ?? entrega.hora_inicio;
        const fim = hora_fim ?? entrega.hora_fim;
        const endereco = endereco_entrega ?? entrega.endereco_entrega;

        // Verificar campos obrigatórios
        if (!clienteId || !data || !inicio || !fim || !endereco) {
            return res.status(400).json({
                erro: 'Informe o cliente, data, horário de início, horário de fim e endereço da entrega'
            });
        }

        // Verificar se o cliente existe
        const cliente = await Cliente.findByPk(clienteId);

        if (!cliente) {
            return res.status(404).json({
                erro: 'Cliente não encontrado'
            });
        }

        // Verificar horário
        if (inicio >= fim) {
            return res.status(400).json({
                erro: 'O horário de início deve ser menor que o horário de fim'
            });
        }

        // Verificar data
        const agora = new Date();
        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const dia = String(agora.getDate()).padStart(2, '0');
        const hoje = `${ano}-${mes}-${dia}`;

        if (data < hoje) {
            return res.status(400).json({
                erro: 'A data da entrega não pode ser anterior à data atual'
            });
        }

        // Verificar entregador
        if (entregadorId) {
            const entregador = await Entregador.findByPk(entregadorId);

            if (!entregador) {
                return res.status(404).json({
                    erro: 'Entregador não encontrado'
                });
            }

            if (!entregador.ativo) {
                return res.status(400).json({
                    erro: 'O entregador está inativo e não pode receber novas entregas'
                });
            }

            const dentroDaDisponibilidade = horarioDisponivel(
                entregador.disponibilidade,
                inicio,
                fim
            );

            console.log('resultado:', dentroDaDisponibilidade);

            if (!dentroDaDisponibilidade) {
                return res.status(400).json({
                    erro: 'O horário da entrega está fora da disponibilidade do entregador'
                });
            }
        }

        // Buscar entregas do mesmo entregador e data
        const entregasDoDia = await Entrega.findAll({
            where: {
                id_entregador: entregadorId,
                data_entrega: data
            }
        });

        // Verificar conflitos de horário
        for (const entregaExistente of entregasDoDia) {

            // Ignorar a própria entrega que está sendo atualizada
            if (entregaExistente.id_entrega == entrega.id_entrega) {
                continue;
            }

            if (
                inicio < entregaExistente.hora_fim &&
                fim > entregaExistente.hora_inicio
            ) {
                return res.status(400).json({
                    erro: 'O entregador já possui uma entrega nesse horário'
                });
            }
        }

        // Atualizar entrega
        await entrega.update(req.body);

        res.json(entrega);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar entrega'
        });
    }
});


// EXCLUIR ENTREGA
router.delete('/:id', async (req, res) => {
    try {
        const entrega = await Entrega.findByPk(req.params.id);

        if (!entrega) {
            return res.status(404).json({
                erro: 'Entrega não encontrada'
            });
        }

        await entrega.destroy();

        res.json({
            mensagem: 'Entrega excluída com sucesso'
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir entrega'
        });
    }
});

module.exports = router;