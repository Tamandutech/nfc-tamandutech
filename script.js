// ===============================
// DADOS DOS USUÁRIOS
// ===============================

const usuarios = {

    "Administrativo": [
        {
            nome: "Rafaela",
            emoji: "👩"
        },
        {
            nome: "Falbo",
            emoji: "👨"
        }
    ],

    "Combate": [
        {
            nome: "Bubu",
            emoji: "👨"
        },
        {
            nome: "Liz",
            emoji: "👩"
        }
    ],

    "Hockey": [
        {
            nome: "Faustino",
            emoji: "👨"
        }
    ],

    "Sumô": [
        {
            nome: "Camis",
            emoji: "👩"
        }
    ],

    "Sumô LEGO": [
        {
            nome: "Veloso",
            emoji: "👨"
        }
    ],

    "Seguidor de Linha": [
        {
            nome: "Laís",
            emoji: "👩"
        }
    ]

};


// ===============================
// VARIÁVEIS
// ===============================

let categoriaSelecionada = "";
let usuarioSelecionado = "";


// ===============================
// SELECIONAR CATEGORIA
// ===============================

function selecionarCategoria(categoria) {

    categoriaSelecionada = categoria;

    document.getElementById("tela-categorias")
        .classList.add("escondido");

    document.getElementById("tela-usuarios")
        .classList.remove("escondido");

    document.getElementById("titulo-categoria")
        .textContent = categoria;

    mostrarUsuarios(categoria);
}


// ===============================
// MOSTRAR USUÁRIOS
// ===============================

function mostrarUsuarios(categoria) {

    const container = document.getElementById("usuarios");

    container.innerHTML = "";

    const lista = usuarios[categoria] || [];

    lista.forEach(usuario => {

        const botao = document.createElement("button");

        botao.classList.add("usuario");

        botao.innerHTML = `
            <span class="emoji">${usuario.emoji}</span>
            <span>${usuario.nome}</span>
        `;

        botao.onclick = function () {
            selecionarUsuario(usuario);
        };

        container.appendChild(botao);

    });
}


// ===============================
// SELECIONAR USUÁRIO
// ===============================

function selecionarUsuario(usuario) {

    usuarioSelecionado = usuario;

    document.getElementById("tela-usuarios")
        .classList.add("escondido");

    document.getElementById("tela-usuario")
        .classList.remove("escondido");

    document.getElementById("nome-usuario")
        .textContent = usuario.nome;

    document.getElementById("categoria-usuario")
        .textContent = categoriaSelecionada;

    document.getElementById("personagem")
        .textContent = usuario.emoji;
}


// ===============================
// COMEÇAR USO
// ===============================

function comecarUso() {

    const agora = new Date();

    const horario = agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    document.getElementById("tela-usuario")
        .classList.add("escondido");

    document.getElementById("tela-em-uso")
        .classList.remove("escondido");

    document.getElementById("mensagem-uso")
        .textContent =
        `${usuarioSelecionado.nome} está usando a cafeteira.`;

    document.getElementById("horario-uso")
        .textContent =
        `🕐 Começou às ${horario}`;
}


// ===============================
// FINALIZAR USO
// ===============================

function finalizarUso() {

    alert(
        `Obrigada, ${usuarioSelecionado.nome}! ☕✨`
    );

    voltarCategorias();
}


// ===============================
// VOLTAR PARA CATEGORIAS
// ===============================

function voltarCategorias() {

    document.getElementById("tela-usuarios")
        .classList.add("escondido");

    document.getElementById("tela-usuario")
        .classList.add("escondido");

    document.getElementById("tela-em-uso")
        .classList.add("escondido");

    document.getElementById("tela-categorias")
        .classList.remove("escondido");

}


// ===============================
// VOLTAR PARA USUÁRIOS
// ===============================

function voltarUsuarios() {

    document.getElementById("tela-usuario")
        .classList.add("escondido");

    document.getElementById("tela-usuarios")
        .classList.remove("escondido");

}
