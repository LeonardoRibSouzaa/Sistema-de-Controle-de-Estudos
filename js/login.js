/**
 * login.js
 * Responsável por capturar os dados do formulário de login
 * e redirecionar o usuário para a tela principal (menu.html).
 */

/**
 * Função logar()
 * Adiciona um listener ao formulário de login.
 * Ao submeter, salva o nome do usuário no localStorage
 * e redireciona para a página do menu.
 */
function logar() {
    // Seleciona o formulário de login pelo id
    const form = document.getElementById('login_form');

    // Adiciona o evento de submit ao formulário
    form.addEventListener('submit', (e) => {
        // Impede o comportamento padrão de recarregar a página
        e.preventDefault();

        // Captura os dados preenchidos no formulário
        const formData = new FormData(form);

        // Converte o FormData em um objeto simples { usuario, senha }
        const data = Object.fromEntries(formData.entries());

        // Exibe no console quem fez login (útil para debug)
        console.log("usuario ", data.usuario, " fez login");

        // Salva o nome do usuário no localStorage para uso nas outras páginas
        localStorage.setItem("usuario", data.usuario);

        // Redireciona para a página principal do sistema
        window.location.href = window.location.origin + "/menu.html";
    });
}

// Inicializa a função de login ao carregar a página
logar();