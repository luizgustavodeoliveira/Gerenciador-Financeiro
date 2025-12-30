'use strict';

// Seleção de elementos do DOM
const btn_add_transacao = document.querySelector('#btn-add-transacao');
const input_descricao = document.querySelector('#input-desc');
const input_valor = document.querySelector('#input-valor');
const input_categoria = document.querySelector('#input-categoria');
const input_data = document.querySelector('#input-data');
const input_radios = [...document.querySelectorAll('input[type=radio]')];
const corpo_tabela = document.querySelector('#corpo-tabela');

// Elementos de exibição do resumo
const span_entradas = document.querySelector('#span-entradas');
const span_saidas = document.querySelector('#span-saidas');
const span_balanco = document.querySelector('#span-balanco');

// Carrega dados do LocalStorage ou inicia array vazio
let lista_transacoes = JSON.parse(localStorage.getItem('minhas_transacoes')) || [];

// Converte números para o formato de moeda Real (BRL)
function formatarMoeda(valor){
    return (Number(valor).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));
}

// Calcula totais de entrada, saída e saldo final
function atualizarCalculos(array){
    let total_entradas = 0;
    let total_saidas = 0;

    array.forEach(el => {
        if(el.tipo === 'Entrada'){
            total_entradas += Number(el.valor);
        } else {
            total_saidas += Number(el.valor);
        }
    });

    let balanco = total_entradas - total_saidas;

    // Atualiza interface com valores formatados
    span_entradas.textContent = formatarMoeda(total_entradas);
    span_saidas.textContent = formatarMoeda(total_saidas);
    span_balanco.textContent = formatarMoeda(balanco);

    // Altera cor do saldo se for negativo
    span_balanco.style.color = balanco < 0 ? '#991818' : '#000';
}

// Gera o HTML da tabela a partir do array de transações
function renderizarTabela(lista_transacoes){
    corpo_tabela.innerHTML = ''; // Limpa tabela antes de renderizar

    lista_transacoes.forEach(el => {
        let nova_linha_tabela = document.createElement('tr');

        // Define cor de fundo da linha conforme o tipo
        nova_linha_tabela.style.backgroundColor = el.tipo === 'Entrada' ? '#98e595a1' : '#e59595a1';

        // Criação das células de dados
        let divisao_valor = document.createElement('td');
        divisao_valor.textContent = formatarMoeda(el.valor);

        let divisao_categoria = document.createElement('td');
        divisao_categoria.textContent = el.categoria;

        let divisao_data = document.createElement('td');
        divisao_data.textContent = new Date(el.data.replace(/-/g, '\/')).toLocaleDateString('pt-br');

        let divisao_tipo = document.createElement('td');
        divisao_tipo.textContent = el.tipo;

        // Configuração do ícone de deletar
        let span_deletar = document.createElement('span');
        span_deletar.classList.add('material-symbols-outlined', 'span-delete');
        span_deletar.innerHTML = 'delete';
        span_deletar.style.marginLeft = '1rem';
        span_deletar.onclick = () => apagarTransacao(el.id);

        let p_celula = document.createElement('p');
        p_celula.textContent = el.descricao;

        // Embrulho para alinhar texto e ícone na descrição
        let embrulho_td = document.createElement('div');
        embrulho_td.classList.add('embrulho-td');
        embrulho_td.appendChild(p_celula);
        embrulho_td.appendChild(span_deletar);

        let divisao_desc = document.createElement('td');
        divisao_desc.appendChild(embrulho_td);

        // Montagem final da linha
        nova_linha_tabela.append(divisao_desc, divisao_tipo, divisao_categoria, divisao_data, divisao_valor);
        corpo_tabela.appendChild(nova_linha_tabela);
    });
}

// Captura dados do form e salva no array principal
function adicionarTransacao(){
    let input_marcado_id = input_radios.find(el => el.checked).id;
    let radio_marcado_text = input_marcado_id === 'radio-entrada' ? 'Entrada' : 'Saída';

    const novaTransacao = {
        id: Date.now(), // ID único baseado no timestamp
        descricao: input_descricao.value,
        valor: input_valor.value,
        categoria: input_categoria.value,
        data: input_data.value,
        tipo: radio_marcado_text
    };

    lista_transacoes.push(novaTransacao);
}

// Inicializa a aplicação carregando os dados na tela
function init(){
    renderizarTabela(lista_transacoes);
    atualizarCalculos(lista_transacoes);
}

// Evento de clique para adicionar nova transação
btn_add_transacao.addEventListener('click', ()=>{
    // Validação de campos vazios
    if((input_descricao.value.trim() === '') || (input_valor.value.trim() === '') || 
       (input_categoria.value.trim() === '') || (input_data.value.trim() === '')){
        alert('Preencha os campos corretamente');
        return;
    }

    adicionarTransacao();
    init(); // Atualiza interface
    
    // Persiste dados no navegador
    localStorage.setItem('minhas_transacoes', JSON.stringify(lista_transacoes));

    // Limpa campos do formulário
    input_descricao.value = '';
    input_valor.value = '';
    input_categoria.value = '';
    input_data.value = '';
});

// Remove transação pelo ID e atualiza sistema
function apagarTransacao(id){
    lista_transacoes = lista_transacoes.filter(el => el.id !== id);
    localStorage.setItem('minhas_transacoes', JSON.stringify(lista_transacoes));
    init();
}

// Execução inicial
init();