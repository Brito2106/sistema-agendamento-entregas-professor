const API = 'http://localhost:3000';


// =========================
// ELEMENTOS DO HTML
// =========================

const dataInput =
    document.getElementById('data');

const entregadorSelect =
    document.getElementById('entregador');

const btnContinuar =
    document.getElementById('btnContinuar');

const horariosContainer =
    document.getElementById('horarios');

const manhaContainer =
    document.getElementById('manha');

const tardeContainer =
    document.getElementById('tarde');

const btnAdicionarItem =
    document.getElementById('btnAdicionarItem');

const itensEntregaContainer =
    document.getElementById('itensEntrega');

const formularioEntrega =
    document.getElementById('formularioEntrega');

const horarioSelecionado =
    document.getElementById('horarioSelecionado');

const clienteSelect =
    document.getElementById('cliente');

const enderecoInput =
    document.getElementById('enderecoEntrega');

const descricaoInput =
    document.getElementById('descricao');

const observacaoInput =
    document.getElementById('observacao');

const btnConfirmarEntrega =
    document.getElementById('btnConfirmarEntrega');


// =========================
// AGENDA
// =========================

const btnAgenda =
    document.getElementById('btnAgenda');

const listaAgenda =
    document.getElementById('listaAgenda');

const totalEntregas =
    document.getElementById('totalEntregas');

const agendaContainer =
    document.getElementById('agenda');


// =========================
// MODAL
// =========================

const modalEntrega =
    document.getElementById('modalEntrega');

const detalhesEntrega =
    document.getElementById('detalhesEntrega');

const btnFecharModal =
    document.getElementById('btnFecharModal');

const btnIniciarEntrega =
    document.getElementById('btnIniciarEntrega');

const btnConcluirEntrega =
    document.getElementById('btnConcluirEntrega');

const btnCancelarEntrega =
    document.getElementById('btnCancelarEntrega');

const btnEditarEntrega =
    document.getElementById('btnEditarEntrega');

const formularioEdicao =
    document.getElementById('formularioEdicao');

const editarCliente =
    document.getElementById('editarCliente');

const editarEntregador =
    document.getElementById('editarEntregador');

const editarData =
    document.getElementById('editarData');

const editarHoraInicio =
    document.getElementById('editarHoraInicio');

const editarHoraFim =
    document.getElementById('editarHoraFim');

const editarEndereco =
    document.getElementById('editarEndereco');

const btnSalvarEdicao =
    document.getElementById('btnSalvarEdicao');

const btnCancelarEdicao =
    document.getElementById('btnCancelarEdicao');

const itensEdicao =
    document.getElementById('itensEdicao');

const btnAdicionarItemEdicao =
    document.getElementById('btnAdicionarItemEdicao');

// =========================
// VARIÁVEIS
// =========================

let horarioSelecionadoAtual = null;

let entregaAtual = null;


// =========================
// CARREGAR ENTREGADORES
// =========================

async function carregarEntregadores() {

    try {

        console.log('Buscando entregadores...');

        const resposta =
            await fetch(`${API}/entregadores`);

        console.log(
            'Status:',
            resposta.status
        );

        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );
        }

        const entregadores =
            await resposta.json();

        console.log(
            'Entregadores recebidos:',
            entregadores
        );

        entregadorSelect.innerHTML = `
            <option value="">
                Selecione um entregador
            </option>
        `;

        if (!Array.isArray(entregadores)) {

            console.error(
                'A API não retornou uma lista:',
                entregadores
            );

            return;
        }

        if (entregadores.length === 0) {

            console.warn(
                'Nenhum entregador cadastrado.'
            );

            return;
        }

        entregadores.forEach(
            (entregador) => {

                const option =
                    document.createElement('option');

                option.value =
                    entregador.id_entregador;

                option.textContent =
                    entregador.nome;

                entregadorSelect.appendChild(
                    option
                );
            }
        );

        console.log(
            'Entregadores carregados com sucesso.'
        );

    } catch (erro) {

        console.error(
            'Erro ao carregar entregadores:',
            erro
        );

        alert(
            'Não foi possível carregar os entregadores.'
        );
    }
}


// =========================
// CARREGAR CLIENTES
// =========================

async function carregarClientes() {

    try {

        const resposta =
            await fetch(`${API}/clientes`);

        if (!resposta.ok) {

            throw new Error(
                'Erro ao buscar clientes'
            );
        }

        const clientes =
            await resposta.json();

        clienteSelect.innerHTML = `
            <option value="">
                Selecione um cliente
            </option>
        `;

        clientes.forEach(
            (cliente) => {

                const option =
                    document.createElement('option');

                option.value =
                    cliente.id_cliente;

                option.textContent =
                    cliente.nome;

                clienteSelect.appendChild(
                    option
                );
            }
        );

    } catch (erro) {

        console.error(erro);

        alert(
            'Não foi possível carregar os clientes.'
        );
    }
}


// =========================
// CARREGAR HORÁRIOS
// =========================

async function carregarHorarios() {

    const data =
        dataInput.value;

    const idEntregador =
        entregadorSelect.value;


    if (!data) {

        alert(
            'Escolha uma data.'
        );

        return;
    }


    if (!idEntregador) {

        alert(
            'Escolha um entregador.'
        );

        return;
    }


    try {

        const resposta =
            await fetch(
                `${API}/entregas/disponiveis?data=${data}&id_entregador=${idEntregador}`
            );


        if (!resposta.ok) {

            throw new Error(
                'Erro ao buscar horários'
            );
        }


        const dados =
            await resposta.json();


        mostrarHorarios(dados);


    } catch (erro) {

        console.error(erro);

        alert(
            'Não foi possível carregar os horários.'
        );
    }
}


// =========================
// MOSTRAR HORÁRIOS
// =========================

function mostrarHorarios(dados) {

    horariosContainer.style.display =
        'block';


    manhaContainer.innerHTML =
        '<h3>Manhã</h3>';

    tardeContainer.innerHTML =
        '<h3>Tarde</h3>';


    if (dados.manha) {

        dados.manha.forEach(
            (horario) => {

                criarHorario(
                    horario,
                    manhaContainer
                );
            }
        );
    }


    if (dados.tarde) {

        dados.tarde.forEach(
            (horario) => {

                criarHorario(
                    horario,
                    tardeContainer
                );
            }
        );
    }
}


// =========================
// CRIAR BOTÃO DE HORÁRIO
// =========================

function criarHorario(
    horario,
    container
) {

    const botao =
        document.createElement('button');


    botao.type =
        'button';


    botao.classList.add(
        'horario'
    );


    botao.textContent =
        `${horario.hora_inicio.substring(0, 5)} - ${horario.hora_fim.substring(0, 5)} | ${horario.status}`;


    if (
        horario.status === 'Livre'
    ) {

        botao.classList.add(
            'livre'
        );

    } else {

        botao.classList.add(
            'agendado'
        );
    }


    botao.addEventListener(
        'click',
        async () => {

            if (
                horario.status === 'Livre'
            ) {

                abrirFormularioEntrega(
                    horario
                );

                return;
            }


            // Busca a entrega completa no backend

            const idEntrega =
                horario.entrega?.id_entrega;


            if (!idEntrega) {

                alert(
                    'Não foi possível identificar a entrega.'
                );

                return;
            }


            try {

                const resposta =
                    await fetch(
                        `${API}/entregas/${idEntrega}`
                    );


                if (!resposta.ok) {

                    throw new Error(
                        `Erro HTTP: ${resposta.status}`
                    );
                }


                const entregaCompleta =
                    await resposta.json();


                console.log(
                    'Entrega completa:',
                    entregaCompleta
                );


                mostrarDetalhesEntrega(
                    entregaCompleta,
                    horario.hora_inicio,
                    horario.hora_fim
                );


            } catch (erro) {

                console.error(
                    'Erro ao buscar entrega:',
                    erro
                );


                alert(
                    'Não foi possível carregar os detalhes da entrega.'
                );
            }
        }
    );


    container.appendChild(
        botao
    );
}


// =========================
// ABRIR FORMULÁRIO
// =========================

function abrirFormularioEntrega(
    horario
) {

    horarioSelecionadoAtual =
        horario;


    formularioEntrega.style.display =
        'block';


    horarioSelecionado.textContent =
        `Horário selecionado: ${horario.hora_inicio.substring(0, 5)} - ${horario.hora_fim.substring(0, 5)}`;


    formularioEntrega.scrollIntoView({
        behavior: 'smooth'
    });
}


// =========================
// ADICIONAR ITEM
// =========================

btnAdicionarItem.addEventListener(
    'click',
    () => {

        const novoItem =
            document.createElement('div');


        novoItem.classList.add(
            'item'
        );


        novoItem.innerHTML = `
            <label>Produto</label>

            <input
                type="text"
                class="produto"
                placeholder="Ex: Cimento"
            >

            <label>Quantidade</label>

            <input
                type="number"
                class="quantidade"
                placeholder="Ex: 10"
                min="1"
            >
        `;


        itensEntregaContainer.appendChild(
            novoItem
        );
    }
);


// =========================
// CONFIRMAR ENTREGA
// =========================

async function confirmarEntrega() {

    if (!horarioSelecionadoAtual) {

        alert(
            'Selecione um horário.'
        );

        return;
    }


    const idCliente =
        clienteSelect.value;

    const endereco =
        enderecoInput.value.trim();

    const descricao =
        descricaoInput.value.trim();

    const observacao =
        observacaoInput.value.trim();


    const itens = [];


    const produtos =
        document.querySelectorAll(
            '.produto'
        );

    const quantidades =
        document.querySelectorAll(
            '.quantidade'
        );


    for (
        let i = 0;
        i < produtos.length;
        i++
    ) {

        const produto =
            produtos[i].value.trim();

        const quantidade =
            quantidades[i].value;


        if (
            produto &&
            quantidade
        ) {

            itens.push({
                produto: produto,
                quantidade: Number(
                    quantidade
                )
            });
        }
    }


    if (!idCliente) {

        alert(
            'Selecione um cliente.'
        );

        return;
    }


    if (!endereco) {

        alert(
            'Informe o endereço da entrega.'
        );

        return;
    }


    const data =
        dataInput.value;

    const idEntregador =
        entregadorSelect.value;


    const novaEntrega = {

        id_cliente:
            Number(idCliente),

        id_entregador:
            Number(idEntregador),

        data_entrega:
            data,

        hora_inicio:
            horarioSelecionadoAtual
                .hora_inicio,

        hora_fim:
            horarioSelecionadoAtual
                .hora_fim,

        endereco_entrega:
            endereco,

        descricao:
            descricao || null,

        observacao:
            observacao || null
    };


    try {

        const resposta =
            await fetch(
                `${API}/entregas`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            novaEntrega
                        )
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.erro ||
                'Não foi possível cadastrar a entrega.'
            );

            return;
        }


        // =========================
        // CADASTRAR ITENS
        // =========================

        for (
            const item of itens
        ) {

            const respostaItem =
                await fetch(
                    `${API}/itens-entrega`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify({
                                id_entrega:
                                    dados.id_entrega,

                                produto:
                                    item.produto,

                                quantidade:
                                    item.quantidade
                            })
                    }
                );


            if (!respostaItem.ok) {

                console.error(
                    'Erro ao cadastrar item:',
                    await respostaItem.json()
                );
            }
        }


        const nomeCliente =
            clienteSelect.options[
                clienteSelect.selectedIndex
            ].text;


        const nomeEntregador =
            entregadorSelect.options[
                entregadorSelect.selectedIndex
            ].text;


        const listaItens =
            itens
                .map(
                    item =>
                        `• ${item.produto} - ${item.quantidade}`
                )
                .join('\n');


        alert(
            `ENTREGA AGENDADA COM SUCESSO!\n\n` +

            `Entrega: #${dados.id_entrega}\n` +

            `Cliente: ${nomeCliente}\n` +

            `Data: ${data}\n` +

            `Horário: ${horarioSelecionadoAtual.hora_inicio.substring(0, 5)} - ${horarioSelecionadoAtual.hora_fim.substring(0, 5)}\n` +

            `Entregador: ${nomeEntregador}\n` +

            `Endereço: ${endereco}\n\n` +

            `Itens:\n${listaItens || 'Nenhum item cadastrado'}`
        );


        // =========================
        // LIMPAR FORMULÁRIO
        // =========================

        clienteSelect.value = '';

        enderecoInput.value = '';

        descricaoInput.value = '';

        observacaoInput.value = '';


        itensEntregaContainer.innerHTML = `
            <div class="item">

                <label>Produto</label>

                <input
                    type="text"
                    class="produto"
                    placeholder="Ex: Cimento"
                >

                <label>Quantidade</label>

                <input
                    type="number"
                    class="quantidade"
                    placeholder="Ex: 10"
                    min="1"
                >

            </div>
        `;


        formularioEntrega.style.display =
            'none';


        await carregarHorarios();


    } catch (erro) {

        console.error(erro);

        alert(
            'Erro ao conectar com o servidor.'
        );
    }
}


// =========================
// MOSTRAR DETALHES
// =========================

async function mostrarDetalhesEntrega(
    entrega,
    horaInicio,
    horaFim
) {

    if (!entrega) {

        alert(
            'Não foi possível encontrar os dados desta entrega.'
        );

        return;
    }


    entregaAtual =
        entrega;


    const cliente =
        entrega.cliente?.nome ||
        entrega.Cliente?.nome ||
        'Não informado';


    const nomeEntregador =
        entregadorSelect.options[
            entregadorSelect.selectedIndex
        ]?.text ||
        'Não informado';


    const status =
        entrega.status ||
        'Agendada';


    let itens =
        '<li>Nenhum item cadastrado</li>';

    try {

        const respostaItens =
            await fetch(
                `${API}/itens-entrega/entrega/${entrega.id_entrega}`
            );

        if (respostaItens.ok) {

            const dadosItens =
                await respostaItens.json();

            if (
                dadosItens.itens &&
                dadosItens.itens.length > 0
            ) {

                itens =
                    dadosItens.itens
                        .map(
                            item =>
                                `<li>${item.produto} - quantidade: ${item.quantidade}</li>`
                        )
                        .join('');
            }
        }

    } catch (erro) {

        console.error(
            'Erro ao carregar itens da entrega:',
            erro
        );
    }


    detalhesEntrega.innerHTML = `

        <p>
            <strong>Entrega:</strong>
            #${entrega.id_entrega}
        </p>

        <p>
            <strong>Cliente:</strong>
            ${cliente}
        </p>

        <p>
            <strong>Entregador:</strong>
            ${nomeEntregador}
        </p>

        <p>
            <strong>Endereço:</strong>
            ${entrega.endereco_entrega || 'Não informado'}
        </p>

        <p>
            <strong>Horário:</strong>
            ${horaInicio.substring(0, 5)}
            -
            ${horaFim.substring(0, 5)}
        </p>

        <p>
            <strong>Status:</strong>
            ${status}
        </p>

        <p>
            <strong>Descrição:</strong>
            ${entrega.descricao || 'Nenhuma'}
        </p>

        <p>
            <strong>Observação:</strong>
            ${entrega.observacao || 'Nenhuma'}
        </p>

        <p>
            <strong>Itens:</strong>
        </p>

        <ul>
            ${itens}
        </ul>

    `;


    // =========================
    // BOTÕES DO MODAL
    // =========================

    if (status === 'Agendada') {

        btnEditarEntrega.style.display =
            'block';

        btnIniciarEntrega.style.display =
            'block';

        btnConcluirEntrega.style.display =
            'none';

        btnCancelarEntrega.style.display =
            'block';


    } else if (status === 'Em andamento') {

        btnEditarEntrega.style.display =
            'block';

        btnIniciarEntrega.style.display =
            'none';

        btnConcluirEntrega.style.display =
            'block';

        btnCancelarEntrega.style.display =
            'block';


    } else {

        btnEditarEntrega.style.display =
            'none';

        btnIniciarEntrega.style.display =
            'none';

        btnConcluirEntrega.style.display =
            'none';

        btnCancelarEntrega.style.display =
            'none';
    }

    //ABRIR MODAL
    modalEntrega.style.display = 'flex';

    modalEntrega.style.position = 'fixed';
    modalEntrega.style.top = '0';
    modalEntrega.style.left = '0';

    modalEntrega.style.width = '100vw';
    modalEntrega.style.height = '100vh';

    modalEntrega.style.zIndex = '99999';

    modalEntrega.style.backgroundColor =
        'rgba(0, 0, 0, 0.55)';

    modalEntrega.style.justifyContent = 'center';
    modalEntrega.style.alignItems = 'center';

    modalEntrega.style.padding = '20px';


    // Caixa interna do modal

    const caixaModal =
        modalEntrega.querySelector('.modal-conteudo');

    if (caixaModal) {

        caixaModal.style.position = 'relative';

        caixaModal.style.width = '100%';
        caixaModal.style.maxWidth = '550px';

        caixaModal.style.maxHeight = '85vh';

        caixaModal.style.overflowY = 'auto';

        caixaModal.style.backgroundColor = 'white';

        caixaModal.style.padding = '30px';

        caixaModal.style.borderRadius = '15px';

        caixaModal.style.boxShadow =
            '0 10px 35px rgba(0, 0, 0, 0.25)';
    }
}

// =========================
// ABRIR EDIÇÃO
// =========================

async function abrirEdicaoEntrega() {

    if (!entregaAtual) {
        return;
    }

    // Não permite editar concluída ou cancelada

    if (
        entregaAtual.status === 'Concluída' ||
        entregaAtual.status === 'Cancelada'
    ) {

        alert(
            'Esta entrega não pode mais ser editada.'
        );

        return;
    }


    // Carregar clientes novamente

    await carregarClientesEdicao();

    // Carregar entregadores novamente

    await carregarEntregadoresEdicao();


    // Preencher cliente

    editarCliente.value =
        entregaAtual.id_cliente;


    // Preencher entregador

    editarEntregador.value =
        entregaAtual.id_entregador;


    // Preencher data

    editarData.value =
        entregaAtual.data_entrega;


    // Preencher horários

    editarHoraInicio.value =
        entregaAtual.hora_inicio
            ? entregaAtual.hora_inicio.substring(0, 5)
            : '';


    editarHoraFim.value =
        entregaAtual.hora_fim
            ? entregaAtual.hora_fim.substring(0, 5)
            : '';


    // Preencher endereço

    editarEndereco.value =
        entregaAtual.endereco_entrega || '';

    // Carregar itens da entrega
    await carregarItensEdicao();


    // Mostrar formulário

    formularioEdicao.style.display =
        'block';


    // Esconder botões normais

    document.querySelector(
        '.acoes-entrega'
    ).style.display = 'none';
}

async function carregarClientesEdicao() {

    try {

        const resposta =
            await fetch(`${API}/clientes`);


        const clientes =
            await resposta.json();


        editarCliente.innerHTML = `
            <option value="">
                Selecione um cliente
            </option>
        `;


        clientes.forEach(
            (cliente) => {

                const option =
                    document.createElement('option');

                option.value =
                    cliente.id_cliente;

                option.textContent =
                    cliente.nome;

                editarCliente.appendChild(
                    option
                );
            }
        );

    } catch (erro) {

        console.error(erro);

        alert(
            'Não foi possível carregar os clientes.'
        );
    }
}

async function carregarEntregadoresEdicao() {

    try {

        const resposta =
            await fetch(`${API}/entregadores`);


        const entregadores =
            await resposta.json();


        editarEntregador.innerHTML = `
            <option value="">
                Selecione um entregador
            </option>
        `;


        entregadores.forEach(
            (entregador) => {

                const option =
                    document.createElement('option');

                option.value =
                    entregador.id_entregador;

                option.textContent =
                    entregador.nome;

                editarEntregador.appendChild(
                    option
                );
            }
        );

    } catch (erro) {

        console.error(erro);

        alert(
            'Não foi possível carregar os entregadores.'
        );
    }
}

// =========================
// CARREGAR ITENS PARA EDIÇÃO
// =========================

async function carregarItensEdicao() {

    itensEdicao.innerHTML = '';

    if (!entregaAtual) {
        return;
    }

    try {

        const resposta =
            await fetch(
                `${API}/itens-entrega/entrega/${entregaAtual.id_entrega}`
            );

        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );
        }

        const dados =
            await resposta.json();

        if (
            !dados.itens ||
            dados.itens.length === 0
        ) {

            itensEdicao.innerHTML =
                '<p>Nenhum item cadastrado.</p>';

            return;
        }

        dados.itens.forEach(
            (item) => {

                criarItemEdicao(
                    item
                );
            }
        );

    } catch (erro) {

        console.error(
            'Erro ao carregar itens:',
            erro
        );

        alert(
            'Não foi possível carregar os itens da entrega.'
        );
    }
}


// =========================
// CRIAR ITEM NA EDIÇÃO
// =========================

function criarItemEdicao(
    item = null
) {

    const div =
        document.createElement('div');

    div.classList.add(
        'item',
        'item-edicao'
    );

    if (item) {

        div.dataset.id =
            item.id_item;
    }

    div.innerHTML = `

        <label>Produto</label>

        <input
            type="text"
            class="produto-edicao"
            placeholder="Ex: Cimento"
            value="${item ? item.produto : ''}"
        >

        <label>Quantidade</label>

        <input
            type="number"
            class="quantidade-edicao"
            placeholder="Ex: 10"
            min="1"
            value="${item ? item.quantidade : ''}"
        >

        <button
            type="button"
            class="btnExcluirItemEdicao"
        >
            Excluir item
        </button>

    `;

    const btnExcluir =
        div.querySelector(
            '.btnExcluirItemEdicao'
        );

    btnExcluir.addEventListener(
        'click',
        async () => {

            // ITEM NOVO, ainda não está no banco
            if (!div.dataset.id) {

                div.remove();

                return;
            }

            const confirmar =
                confirm(
                    'Tem certeza que deseja excluir este item?'
                );

            if (!confirmar) {
                return;
            }

            try {

                const resposta =
                    await fetch(
                        `${API}/itens-entrega/${div.dataset.id}`,
                        {
                            method: 'DELETE'
                        }
                    );

                const dados =
                    await resposta.json();

                if (!resposta.ok) {

                    alert(
                        dados.erro ||
                        'Não foi possível excluir o item.'
                    );

                    return;
                }

                div.remove();

                alert(
                    'Item excluído com sucesso.'
                );

            } catch (erro) {

                console.error(
                    'Erro ao excluir item:',
                    erro
                );

                alert(
                    'Erro ao conectar com o servidor.'
                );
            }
        }
    );

    itensEdicao.appendChild(
        div
    );
}


// =========================
// ADICIONAR NOVO ITEM
// =========================

btnAdicionarItemEdicao.addEventListener(
    'click',
    () => {

        // Remove a mensagem de nenhum item
        const mensagem =
            itensEdicao.querySelector('p');

        if (mensagem) {
            mensagem.remove();
        }

        criarItemEdicao();
    }
);

// =========================
// SALVAR EDIÇÃO
// =========================

async function salvarEdicaoEntrega() {

    if (!entregaAtual) {
        return;
    }


    const idCliente =
        editarCliente.value;

    const idEntregador =
        editarEntregador.value;

    const data =
        editarData.value;

    const horaInicio =
        editarHoraInicio.value;

    const horaFim =
        editarHoraFim.value;

    const endereco =
        editarEndereco.value.trim();


    if (!idCliente) {

        alert(
            'Selecione um cliente.'
        );

        return;
    }


    if (!idEntregador) {

        alert(
            'Selecione um entregador.'
        );

        return;
    }


    if (!data) {

        alert(
            'Selecione uma data.'
        );

        return;
    }


    if (!horaInicio || !horaFim) {

        alert(
            'Informe o horário.'
        );

        return;
    }


    if (!endereco) {

        alert(
            'Informe o endereço.'
        );

        return;
    }


    if (
        horaInicio >= horaFim
    ) {

        alert(
            'O horário inicial deve ser menor que o horário final.'
        );

        return;
    }


    const dadosAtualizados = {

        id_cliente:
            Number(idCliente),

        id_entregador:
            Number(idEntregador),

        data_entrega:
            data,

        hora_inicio:
            horaInicio,

        hora_fim:
            horaFim,

        endereco_entrega:
            endereco
    };


    try {

        const resposta =
            await fetch(
                `${API}/entregas/${entregaAtual.id_entrega}`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            dadosAtualizados
                        )
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.erro ||
                'Não foi possível atualizar a entrega.'
            );

            return;
        }


        alert(
            'Entrega atualizada com sucesso!'
        );

        // =========================
        // SALVAR ITENS DA ENTREGA
        // =========================

        const itens =
            itensEdicao.querySelectorAll(
                '.item-edicao'
            );

        for (
            const itemDiv of itens
        ) {

            const produtoInput =
                itemDiv.querySelector(
                    '.produto-edicao'
                );

            const quantidadeInput =
                itemDiv.querySelector(
                    '.quantidade-edicao'
                );

            const produto =
                produtoInput.value.trim();

            const quantidade =
                Number(
                    quantidadeInput.value
                );

            if (!produto) {

                alert(
                    'Informe o produto de todos os itens.'
                );

                return;
            }

            if (
                !Number.isInteger(quantidade) ||
                quantidade <= 0
            ) {

                alert(
                    'A quantidade deve ser um número inteiro maior que zero.'
                );

                return;
            }

            // ITEM JÁ EXISTENTE
            if (itemDiv.dataset.id) {

                const respostaItem =
                    await fetch(
                        `${API}/itens-entrega/${itemDiv.dataset.id}`,
                        {
                            method: 'PUT',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify({
                                    produto:
                                        produto,

                                    quantidade:
                                        quantidade
                                })
                        }
                    );

                const dadosItem =
                    await respostaItem.json();

                if (!respostaItem.ok) {

                    alert(
                        dadosItem.erro ||
                        'Não foi possível atualizar um dos itens.'
                    );

                    return;
                }

                // ITEM NOVO
            } else {

                const respostaItem =
                    await fetch(
                        `${API}/itens-entrega`,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify({
                                    id_entrega:
                                        entregaAtual.id_entrega,

                                    produto:
                                        produto,

                                    quantidade:
                                        quantidade
                                })
                        }
                    );

                const dadosItem =
                    await respostaItem.json();

                if (!respostaItem.ok) {

                    alert(
                        dadosItem.erro ||
                        'Não foi possível cadastrar um novo item.'
                    );

                    return;
                }
            }
        }

        // Buscar dados atualizados

        const respostaEntrega =
            await fetch(
                `${API}/entregas/${entregaAtual.id_entrega}`
            );


        entregaAtual =
            await respostaEntrega.json();


        // Esconder formulário

        formularioEdicao.style.display =
            'none';


        document.querySelector(
            '.acoes-entrega'
        ).style.display = 'flex';


        // Fechar modal

        modalEntrega.style.display =
            'none';


        // Atualizar horários

        await carregarHorarios();

        // Atualizar a agenda do dia

        if (dataInput.value) {
            await carregarAgenda();
        }

    } catch (erro) {

        console.error(erro);

        alert(
            'Erro ao conectar com o servidor.'
        );
    }
}

// =========================
// ALTERAR STATUS
// =========================

async function atualizarStatus(
    idEntrega,
    novoStatus
) {

    try {

        const resposta =
            await fetch(
                `${API}/entregas/${idEntrega}/status`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify({
                            status:
                                novoStatus
                        })
                }
            );


        const dados =
            await resposta.json();


        console.log(
            'Resposta da alteração de status:',
            dados
        );


        if (!resposta.ok) {

            alert(
                dados.erro ||
                'Não foi possível atualizar o status.'
            );

            return false;
        }


        // Atualiza o objeto que está aberto no modal
        if (entregaAtual) {

            entregaAtual.status =
                novoStatus;
        }


        // Atualiza o modal imediatamente
        if (entregaAtual) {

            mostrarDetalhesEntrega(
                entregaAtual,
                entregaAtual.hora_inicio ||
                horarioSelecionadoAtual?.hora_inicio,

                entregaAtual.hora_fim ||
                horarioSelecionadoAtual?.hora_fim
            );
        }


        alert(
            `Status da entrega #${idEntrega} atualizado para "${novoStatus}".`
        );


        // Atualiza os horários da tela
        await carregarHorarios();


        // Atualiza a agenda
        if (dataInput.value) {

            await carregarAgenda();
        }


        return true;


    } catch (erro) {

        console.error(
            'Erro ao atualizar status:',
            erro
        );

        alert(
            'Erro ao conectar com o servidor.'
        );

        return false;
    }
}


// =========================
// CANCELAR ENTREGA
// =========================

async function cancelarEntrega(
    idEntrega
) {

    const confirmar =
        confirm(
            `Tem certeza que deseja cancelar a entrega #${idEntrega}?`
        );


    if (!confirmar) {

        return false;
    }


    try {

        const resposta =
            await fetch(
                `${API}/entregas/${idEntrega}/cancelar`,
                {
                    method: 'PUT'
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.erro ||
                'Não foi possível cancelar a entrega.'
            );

            return false;
        }


        alert(
            `Entrega #${idEntrega} cancelada com sucesso.`
        );


        await carregarHorarios();


        if (dataInput.value) {

            await carregarAgenda();
        }


        return true;


    } catch (erro) {

        console.error(erro);

        alert(
            'Erro ao conectar com o servidor.'
        );

        return false;
    }
}


// =========================
// CARREGAR AGENDA
// =========================

async function carregarAgenda() {

    const data =
        dataInput.value;


    if (!data) {

        alert(
            'Escolha uma data.'
        );

        return;
    }


    try {

        const resposta =
            await fetch(
                `${API}/entregas/agenda?data=${data}`
            );


        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );
        }


        const dados =
            await resposta.json();


        mostrarAgenda(dados);


    } catch (erro) {

        console.error(
            'Erro ao carregar agenda:',
            erro
        );

        alert(
            'Não foi possível carregar a agenda.'
        );
    }
}


// =========================
// MOSTRAR AGENDA
// =========================

function mostrarAgenda(dados) {

    listaAgenda.style.display = 'block';

    agendaContainer.innerHTML = '';

    totalEntregas.textContent =
        `Total de entregas: ${dados.total_entregas || 0}`;


    if (
        !dados.agenda ||
        dados.agenda.length === 0
    ) {

        agendaContainer.innerHTML =
            '<p>Nenhuma entrega agendada para este dia.</p>';

        return;
    }


    dados.agenda.forEach((entrega) => {

        const div =
            document.createElement('div');


        div.classList.add(
            'entrega-agenda'
        );


        // =========================
        // HORÁRIO
        // =========================

        const horaInicio =
            entrega.horario?.inicio
                ? entrega.horario.inicio.substring(0, 5)
                : '';


        const horaFim =
            entrega.horario?.fim
                ? entrega.horario.fim.substring(0, 5)
                : '';


        // =========================
        // CLIENTE
        // =========================

        const nomeCliente =
            entrega.cliente ||
            'Cliente não informado';


        // =========================
        // ENTREGADOR
        // =========================

        const nomeEntregador =
            entrega.entregador ||
            'Entregador não informado';


        // =========================
        // PRODUTOS
        // =========================

        let produtosHTML =
            '<li>Nenhum item cadastrado</li>';


        if (
            entrega.produtos &&
            entrega.produtos.length > 0
        ) {

            produtosHTML =
                entrega.produtos
                    .map((produto) => {

                        return `
                            <li>
                                ${produto.produto}
                                - quantidade:
                                ${produto.quantidade}
                            </li>
                        `;

                    })
                    .join('');
        }


        // =========================
        // CARD DA ENTREGA
        // =========================

        div.innerHTML = `

            <h3>
                Entrega #${entrega.id_entrega}
            </h3>

            <p>
                <strong>Horário:</strong>
                ${horaInicio} - ${horaFim}
            </p>

            <p>
                <strong>Cliente:</strong>
                ${nomeCliente}
            </p>

            <p>
                <strong>Entregador:</strong>
                ${nomeEntregador}
            </p>

            <p>
                <strong>Endereço:</strong>
                ${entrega.endereco || 'Não informado'}
            </p>

            <p>
                <strong>Status:</strong>
                ${entrega.status || 'Agendada'}
            </p>

            <p>
                <strong>Descrição:</strong>
                ${entrega.descricao || 'Nenhuma'}
            </p>

            <p>
                <strong>Observação:</strong>
                ${entrega.observacao || 'Nenhuma'}
            </p>

            <p>
                <strong>Produtos:</strong>
            </p>

            <ul>
                ${produtosHTML}
            </ul>

        `;


        agendaContainer.appendChild(
            div
        );

    });
}


// =========================
// BOTÃO CONTINUAR
// =========================

btnContinuar.addEventListener(
    'click',
    carregarHorarios
);


// =========================
// CONFIRMAR ENTREGA
// =========================

btnConfirmarEntrega.addEventListener(
    'click',
    confirmarEntrega
);


// =========================
// AGENDA
// =========================

btnAgenda.addEventListener(
    'click',
    carregarAgenda
);


// =========================
// FECHAR MODAL
// =========================

btnFecharModal.addEventListener(
    'click',
    () => {

        modalEntrega.style.display =
            'none';

    }
);


// =========================
// CLICAR FORA DO MODAL
// =========================

modalEntrega.addEventListener(
    'click',
    (evento) => {

        if (
            evento.target ===
            modalEntrega
        ) {

            modalEntrega.style.display =
                'none';
        }
    }
);


// =========================
// INICIAR ENTREGA
// =========================

btnIniciarEntrega.addEventListener(
    'click',
    async () => {

        if (!entregaAtual) {
            return;
        }

        await atualizarStatus(
            entregaAtual.id_entrega,
            'Em andamento'
        );

    }
);


// =========================
// CONCLUIR ENTREGA
// =========================

btnConcluirEntrega.addEventListener(
    'click',
    async () => {

        if (!entregaAtual) {
            return;
        }

        await atualizarStatus(
            entregaAtual.id_entrega,
            'Concluída'
        );

    }
);


// =========================
// CANCELAR ENTREGA
// =========================

btnCancelarEntrega.addEventListener(
    'click',
    async () => {

        if (!entregaAtual) {
            return;
        }


        const sucesso =
            await cancelarEntrega(
                entregaAtual.id_entrega
            );


        if (sucesso) {

            modalEntrega.style.display =
                'none';
        }
    }
);

btnEditarEntrega.addEventListener(
    'click',
    abrirEdicaoEntrega
);

btnCancelarEdicao.addEventListener(
    'click',
    () => {

        formularioEdicao.style.display =
            'none';

        document.querySelector(
            '.acoes-entrega'
        ).style.display = 'flex';

    }
);

btnSalvarEdicao.addEventListener(
    'click',
    salvarEdicaoEntrega
);


// =========================
// INICIAR SISTEMA
// =========================

carregarEntregadores();

carregarClientes();