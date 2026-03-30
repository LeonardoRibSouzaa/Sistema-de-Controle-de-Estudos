/**
 * menu.js
 * Módulo principal do Sistema de Controle de Estudos.
 * Gerencia: cadastro de disciplinas, registro de horas,
 * listagem, busca/filtro, edição, exclusão e dashboard.
 * Armazena os dados no localStorage do navegador.
 */

// -------------------------------------------------------
// ESTADO GLOBAL
// Carrega as disciplinas salvas no localStorage.
// Se não houver nada salvo, inicializa com array vazio.
// -------------------------------------------------------
let disciplinas = JSON.parse(localStorage.getItem("disciplinas") || "[]");

/**
 * salvarDados()
 * Persiste o array de disciplinas no localStorage
 * convertendo-o para string JSON.
 */
function salvarDados() {
    localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
}

// -------------------------------------------------------
// CADASTRO DE DISCIPLINAS
// -------------------------------------------------------

/**
 * bindCadastro()
 * Vincula o evento de submit ao formulário de cadastro.
 * Valida os campos, cria o objeto disciplina e salva.
 */
function bindCadastro() {
    // Seleciona o formulário de cadastro
    const formCadastro = document.getElementById("form_cadastro");

    formCadastro.addEventListener("submit", (e) => {
        // Impede recarregamento da página
        e.preventDefault();

        // Monta o objeto com os dados da nova disciplina
        const nova = {
            nome:           document.getElementById("inp_nome").value,
            professor:      document.getElementById("inp_professor").value,
            carga:          document.getElementById("inp_hora").value,
            area:           document.getElementById("inp_area").value,
            horasEstudadas: 0  // inicia sem horas estudadas
        };

        // Validação: todos os campos devem estar preenchidos
        if (!nova.nome || !nova.professor || !nova.carga || !nova.area) {
            alert("Preencha todos os campos!");
            return;
        }

        // Adiciona a nova disciplina ao array e persiste
        disciplinas.push(nova);
        salvarDados();

        // Limpa o formulário para um novo cadastro
        e.target.reset();
        alert(`"${nova.nome}" cadastrada com sucesso!`);
    });
}

// -------------------------------------------------------
// LISTAGEM E BUSCA DE DISCIPLINAS
// -------------------------------------------------------

/**
 * bindBusca()
 * Vincula o evento de digitação ao campo de busca.
 * A cada tecla pressionada, re-renderiza a lista
 * filtrando pelo texto digitado.
 */
function bindBusca() {
    const campoBusca = document.getElementById("inp_busca");

    // Escuta o evento 'input' para reagir em tempo real
    campoBusca.addEventListener("input", () => {
        // Passa o texto digitado (em minúsculas) para renderLista()
        const termo = campoBusca.value.toLowerCase().trim();
        renderLista(termo);
    });
}

/**
 * renderLista(filtro)
 * Renderiza dinamicamente a lista de disciplinas no DOM.
 * Se um filtro for passado, exibe apenas as disciplinas
 * cujo nome contém o texto buscado.
 * Utiliza createElement e appendChild para criar os elementos.
 * @param {string} filtro - Texto digitado no campo de busca (opcional)
 */
function renderLista(filtro = '') {
    // Seleciona o container onde as disciplinas serão exibidas
    const cont = document.getElementById("lista_disciplinas");

    // Limpa o conteúdo anterior antes de re-renderizar
    cont.innerHTML = '';

    // Filtra o array de disciplinas pelo termo de busca
    // Se filtro estiver vazio, retorna todas as disciplinas
    const resultado = disciplinas.filter(d =>
        d.nome.toLowerCase().includes(filtro)
    );

    // Caso não haja disciplinas (ou nenhum resultado para a busca)
    if (resultado.length === 0) {
        // Cria parágrafo de aviso com createElement
        const msg = document.createElement('p');
        msg.className = 'msg_vazia';
        // Mensagem diferente se é busca sem resultado ou lista vazia
        msg.textContent = filtro
            ? `Nenhuma disciplina encontrada para "${filtro}".`
            : 'Nenhuma disciplina cadastrada.';
        cont.appendChild(msg);
        return;
    }

    // Itera sobre os resultados filtrados e cria cada card no DOM
    resultado.forEach((d) => {
        // Encontra o índice real da disciplina no array original
        // necessário para que editar/excluir referenciem o índice correto
        const i = disciplinas.indexOf(d);

        // Calcula o percentual de progresso da disciplina
        const progresso = Math.round((d.horasEstudadas / d.carga) * 100);

        // --- Cria o container do card ---
        const card = document.createElement('div');

        // --- Nome da disciplina ---
        const nome = document.createElement('strong');
        nome.textContent = d.nome;

        // --- Professor ---
        const professor = document.createElement('span');
        professor.textContent = d.professor;

        // --- Área do conhecimento ---
        const area = document.createElement('span');
        area.textContent = d.area;

        // --- Carga horária ---
        const carga = document.createElement('span');
        carga.textContent = `${d.carga}h`;

        // --- Progresso percentual ---
        const prog = document.createElement('span');
        prog.textContent = `Progresso: ${progresso}%`;

        // --- Botão Excluir ---
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        // Usa o índice real do array via closure
        btnExcluir.addEventListener('click', () => excluir(i));

        // --- Botão Editar ---
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        // Usa o índice real do array via closure
        btnEditar.addEventListener('click', () => abrirEditar(i));

        // Monta o card inserindo todos os elementos filhos com separadores
        card.appendChild(nome);
        card.appendChild(document.createTextNode(' | '));
        card.appendChild(professor);
        card.appendChild(document.createTextNode(' | '));
        card.appendChild(area);
        card.appendChild(document.createTextNode(' | '));
        card.appendChild(carga);
        card.appendChild(document.createTextNode(' | '));
        card.appendChild(prog);
        card.appendChild(btnExcluir);
        card.appendChild(btnEditar);

        // Insere o card no container da lista
        cont.appendChild(card);
    });
}

// -------------------------------------------------------
// EDIÇÃO DE DISCIPLINAS
// -------------------------------------------------------

/**
 * abrirEditar(idx)
 * Preenche o modal de edição com os dados da disciplina
 * selecionada e exibe o modal na tela.
 * @param {number} idx - Índice da disciplina no array
 */
function abrirEditar(idx) {
    const d = disciplinas[idx];

    // Preenche os campos do modal com os dados atuais da disciplina
    document.getElementById('edit_idx').value       = idx;
    document.getElementById('edit_nome').value      = d.nome;
    document.getElementById('edit_professor').value = d.professor;
    document.getElementById('edit_carga').value     = d.carga;
    document.getElementById('edit_area').value      = d.area;

    // Exibe o modal de edição (display flex para centralizar)
    document.getElementById('modal_editar').style.display = 'flex';
}

/**
 * fecharModal()
 * Oculta o modal de edição.
 */
function fecharModal() {
    document.getElementById('modal_editar').style.display = 'none';
}

// Listener do formulário de edição (salvar alterações)
document.getElementById('form_editar').addEventListener('submit', (e) => {
    e.preventDefault();

    // Recupera o índice da disciplina que está sendo editada
    const idx = Number(document.getElementById('edit_idx').value);

    // Atualiza os dados da disciplina no array com os novos valores
    disciplinas[idx].nome      = document.getElementById('edit_nome').value;
    disciplinas[idx].professor = document.getElementById('edit_professor').value;
    disciplinas[idx].carga     = Number(document.getElementById('edit_carga').value);
    disciplinas[idx].area      = document.getElementById('edit_area').value;

    // Persiste, fecha o modal e re-renderiza a lista
    salvarDados();
    fecharModal();
    renderLista();
});

// -------------------------------------------------------
// EXCLUSÃO DE DISCIPLINAS
// -------------------------------------------------------

/**
 * excluir(idx)
 * Solicita confirmação e remove a disciplina do array.
 * @param {number} idx - Índice da disciplina no array
 */
function excluir(idx) {
    // Pede confirmação antes de excluir
    const confirma = confirm(`Deseja excluir "${disciplinas[idx].nome}"?`);
    if (!confirma) return;

    // Remove a disciplina pelo índice usando splice
    disciplinas.splice(idx, 1);
    salvarDados();

    // Re-renderiza a lista após a remoção (mantendo o filtro ativo, se houver)
    const filtroAtivo = document.getElementById("inp_busca").value.toLowerCase().trim();
    renderLista(filtroAtivo);
}

// -------------------------------------------------------
// REGISTRO DE HORAS DE ESTUDO
// -------------------------------------------------------

/**
 * bindHoras()
 * Popula o select de disciplinas e vincula o submit
 * do formulário de registro de horas.
 * Utiliza createElement e appendChild para criar as options.
 */
function bindHoras() {
    // Seleciona o elemento <select> de disciplinas
    const sel = document.getElementById("inp_disciplina");

    // Limpa as options anteriores e adiciona o placeholder
    sel.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value    = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = 'Selecione...';
    sel.appendChild(placeholder);

    // Cria uma <option> para cada disciplina cadastrada
    disciplinas.forEach((d, i) => {
        const option = document.createElement('option');
        option.value       = i;       // índice como valor
        option.textContent = d.nome;  // nome como texto visível
        sel.appendChild(option);
    });

    // Vincula o submit do formulário de horas
    document.getElementById("form_horas").addEventListener("submit", (e) => {
        e.preventDefault();

        // Recupera o índice da disciplina selecionada e as horas informadas
        const idx   = Number(document.getElementById("inp_disciplina").value);
        const horas = Number(document.getElementById("inp_horas").value);

        // Incrementa as horas estudadas da disciplina selecionada
        disciplinas[idx].horasEstudadas += horas;
        salvarDados();

        e.target.reset();
        alert(`${horas}h registradas em "${disciplinas[idx].nome}"!`);
    });
}

// -------------------------------------------------------
// DASHBOARD
// -------------------------------------------------------

/**
 * renderDashboard()
 * Atualiza os cards do dashboard com os totais atuais:
 * total de disciplinas e total de horas estudadas.
 */
function renderDashboard() {
    // Recarrega do localStorage para garantir dados atualizados
    disciplinas = JSON.parse(localStorage.getItem("disciplinas") || "[]");

    // Conta o total de disciplinas cadastradas
    const totalDisciplinas = disciplinas.length;

    // Soma todas as horas estudadas usando reduce
    const horasEstudadas = disciplinas.reduce(
        (total, disciplina) => total + disciplina.horasEstudadas, 0
    );

    // Atualiza os elementos do dashboard via DOM
    document.getElementById("total_disc").textContent  = totalDisciplinas;
    document.getElementById("total_horas").textContent = horasEstudadas;
}

// -------------------------------------------------------
// NAVEGAÇÃO (SIDEBAR)
// -------------------------------------------------------

/**
 * bindControls()
 * Adiciona o evento de clique a cada item da sidebar.
 * Alterna a classe 'active' entre itens e seções,
 * e chama a função de renderização correspondente.
 */
function bindControls() {
    // Seleciona todos os itens do menu lateral
    const sidebarItems = document.querySelectorAll('.sidebar_item');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove 'active' de todos os itens da sidebar
            sidebarItems.forEach(i => i.classList.remove('active'));

            // Adiciona 'active' ao item clicado
            item.classList.add('active');

            // Oculta todas as seções de conteúdo
            document.querySelectorAll('.content_section').forEach(section => {
                section.classList.remove('active');
            });

            // Exibe a seção correspondente ao item clicado
            const qual = item.dataset.section;
            document.getElementById('section_' + qual).classList.add('active');

            // Chama a função de renderização específica de cada seção
            switch (qual) {
                case "diciplinas":
                    renderLista();   // Exibe a lista completa ao entrar na seção
                    bindBusca();     // Ativa o campo de busca/filtro
                    break;
                case "horas":
                    bindHoras();
                    break;
                case "dashboard":
                    renderDashboard();
                    break;
            }
        });
    });
}

// -------------------------------------------------------
// INICIALIZAÇÃO
// -------------------------------------------------------

/**
 * init()
 * Ponto de entrada do sistema.
 * Inicializa os controles, o cadastro e o dashboard.
 * Também exibe o nome do usuário logado no header.
 */
function init() {
    bindControls();    // Ativa a navegação do menu lateral
    bindCadastro();    // Ativa o formulário de cadastro
    renderDashboard(); // Exibe os totais no dashboard ao abrir

    // Recupera e exibe o nome do usuário salvo no login
    const usuario = localStorage.getItem("usuario");
    const usuarioDadoEl = document.getElementById("usuario_dado");
    usuarioDadoEl.textContent = usuario;
}

// Executa a inicialização ao carregar o script
init();