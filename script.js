const CHAVE_PERFIS = "cafeteiraTamandutechPerfis";

const CATEGORIAS_TECNICAS = [
    "Combate",
    "Hockey",
    "Sumô",
    "Sumô LEGO",
    "Seguidor de Linha"
];

const OPCOES_AVATAR = {
    peles: [
        { id: "pele-1", nome: "Pele 1", cor: "#f3c9a7" },
        { id: "pele-2", nome: "Pele 2", cor: "#d89a72" },
        { id: "pele-3", nome: "Pele 3", cor: "#a96646" },
        { id: "pele-4", nome: "Pele 4", cor: "#70402f" }
    ],
    cabelos: [
        { id: "curto", nome: "Curto" },
        { id: "longo", nome: "Longo" },
        { id: "cacheado", nome: "Cacheado" },
        { id: "raspado", nome: "Raspado" }
    ],
    coresCabelo: [
        { id: "castanho", nome: "Castanho", cor: "#5b392b" },
        { id: "preto", nome: "Preto", cor: "#27242b" },
        { id: "loiro", nome: "Loiro", cor: "#d4a94f" },
        { id: "ruivo", nome: "Ruivo", cor: "#a84f31" }
    ],
    roupas: [
        { id: "verde", nome: "Verde", cor: "#4d8b62" },
        { id: "azul", nome: "Azul", cor: "#477ca6" },
        { id: "vermelha", nome: "Vermelha", cor: "#a8463b" },
        { id: "amarela", nome: "Amarela", cor: "#d5a93f" }
    ]
};

const PERFIS_INICIAIS = [
    criarPerfilInicial("rafaela", "Rafaela", true, null, "pele-2", "longo", "castanho", "verde"),
    criarPerfilInicial("falbo", "Falbo", true, null, "pele-1", "curto", "preto", "azul"),
    criarPerfilInicial("bubu", "Bubu", false, "Combate", "pele-3", "cacheado", "preto", "vermelha"),
    criarPerfilInicial("liz", "Liz", false, "Combate", "pele-2", "longo", "ruivo", "azul"),
    criarPerfilInicial("faustino", "Faustino", false, "Hockey", "pele-1", "curto", "castanho", "verde"),
    criarPerfilInicial("camis", "Camis", false, "Sumô", "pele-2", "cacheado", "castanho", "amarela"),
    criarPerfilInicial("veloso", "Veloso", false, "Sumô LEGO", "pele-3", "raspado", "preto", "vermelha"),
    criarPerfilInicial("lais", "Laís", false, "Seguidor de Linha", "pele-2", "longo", "preto", "verde")
];

let perfis = carregarPerfis();
let perfilSelecionado = null;
let inicioUso = null;
let etapaAtual = 1;
let rascunho = criarRascunho();

function criarPerfilInicial(id, nome, administrativo, categoriaTecnica, pele, cabelo, corCabelo, roupa) {
    return {
        id,
        nome,
        administrativo,
        categoriaTecnica,
        avatar: { pele, cabelo, corCabelo, roupa }
    };
}

function criarRascunho() {
    return {
        nome: "",
        administrativo: false,
        categoriaTecnica: null,
        avatar: {
            pele: "pele-2",
            cabelo: "curto",
            corCabelo: "castanho",
            roupa: "verde"
        }
    };
}

function carregarPerfis() {
    try {
        const perfisSalvos = JSON.parse(localStorage.getItem(CHAVE_PERFIS));
        if (Array.isArray(perfisSalvos) && perfisSalvos.length > 0) {
            return perfisSalvos;
        }
    } catch (erro) {
        console.warn("Não foi possível carregar os perfis locais.", erro);
    }

    return JSON.parse(JSON.stringify(PERFIS_INICIAIS));
}

function salvarPerfis() {
    try {
        localStorage.setItem(CHAVE_PERFIS, JSON.stringify(perfis));
    } catch (erro) {
        console.warn("Não foi possível salvar os perfis localmente.", erro);
    }
}

function mostrarTela(idTela) {
    document.querySelectorAll(".tela").forEach(tela => tela.classList.add("escondido"));
    document.getElementById(idTela).classList.remove("escondido");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function nomesDasCategorias(perfil) {
    const categorias = [];
    if (perfil.administrativo) categorias.push("Administrativo");
    if (perfil.categoriaTecnica) categorias.push(perfil.categoriaTecnica);
    return categorias;
}

function resumoDasCategorias(perfil) {
    return nomesDasCategorias(perfil).join(" + ") || "Sem categoria";
}

function buscarOpcao(grupo, id) {
    return OPCOES_AVATAR[grupo].find(opcao => opcao.id === id) || OPCOES_AVATAR[grupo][0];
}

function criarAvatar(perfil, tamanho = "normal") {
    const avatar = perfil.avatar;
    const pele = buscarOpcao("peles", avatar.pele);
    const corCabelo = buscarOpcao("coresCabelo", avatar.corCabelo);
    const roupa = buscarOpcao("roupas", avatar.roupa);

    const container = document.createElement("div");
    container.className = `avatar-container ${tamanho === "mini" ? "mini" : ""}`.trim();
    container.setAttribute("role", "img");
    container.setAttribute("aria-label", `Personagem de ${perfil.nome || "novo perfil"}`);

    const personagem = document.createElement("div");
    personagem.className = `avatar-pixel cabelo-${avatar.cabelo}`;
    personagem.style.setProperty("--pele", pele.cor);
    personagem.style.setProperty("--cabelo", corCabelo.cor);
    personagem.style.setProperty("--roupa", roupa.cor);

    ["cabelo-pixel", "rosto-pixel", "olho-pixel olho-esquerdo", "olho-pixel olho-direito", "corpo-pixel"]
        .forEach(classes => {
            const parte = document.createElement("span");
            parte.className = classes;
            personagem.appendChild(parte);
        });

    container.appendChild(personagem);
    return container;
}

function renderizarPerfis() {
    const lista = document.getElementById("lista-perfis");
    lista.replaceChildren();

    perfis.forEach(perfil => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "perfil-card";
        botao.appendChild(criarAvatar(perfil, "mini"));

        const nome = document.createElement("strong");
        nome.textContent = perfil.nome;
        botao.appendChild(nome);

        const categorias = document.createElement("small");
        categorias.textContent = resumoDasCategorias(perfil);
        botao.appendChild(categorias);

        botao.addEventListener("click", () => selecionarPerfil(perfil.id));
        lista.appendChild(botao);
    });
}

function selecionarPerfil(idPerfil) {
    perfilSelecionado = perfis.find(perfil => perfil.id === idPerfil);
    if (!perfilSelecionado) return;

    const avatarPerfil = document.getElementById("avatar-perfil");
    avatarPerfil.replaceChildren(criarAvatar(perfilSelecionado));
    document.getElementById("nome-perfil").textContent = perfilSelecionado.nome;

    const categoriasPerfil = document.getElementById("categorias-perfil");
    categoriasPerfil.replaceChildren();
    nomesDasCategorias(perfilSelecionado).forEach(categoria => {
        const etiqueta = document.createElement("span");
        etiqueta.className = "categoria-tag";
        etiqueta.textContent = categoria;
        categoriasPerfil.appendChild(etiqueta);
    });

    mostrarTela("tela-perfil");
}

function abrirCriador() {
    rascunho = criarRascunho();
    etapaAtual = 1;
    document.getElementById("formulario-personagem").reset();
    document.getElementById("nome-personagem").value = "";
    renderizarOpcoesCriador();
    atualizarEtapaCriador();
    mostrarTela("tela-criador");
}

function renderizarOpcoesCriador() {
    renderizarCategoriasTecnicas();
    renderizarOpcoesTexto("opcoes-cabelo", OPCOES_AVATAR.cabelos, "cabelo");
    renderizarOpcoesCor("opcoes-pele", OPCOES_AVATAR.peles, "pele");
    renderizarOpcoesCor("opcoes-cor-cabelo", OPCOES_AVATAR.coresCabelo, "corCabelo");
    renderizarOpcoesCor("opcoes-roupa", OPCOES_AVATAR.roupas, "roupa");
}

function renderizarCategoriasTecnicas() {
    const container = document.getElementById("opcoes-tecnicas");
    container.replaceChildren();

    const opcoes = [{ valor: null, nome: "Nenhuma" }]
        .concat(CATEGORIAS_TECNICAS.map(categoria => ({ valor: categoria, nome: categoria })));

    opcoes.forEach(opcao => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "opcao-chip";
        botao.textContent = opcao.nome;
        botao.classList.toggle("selecionada", rascunho.categoriaTecnica === opcao.valor);
        botao.setAttribute("aria-pressed", String(rascunho.categoriaTecnica === opcao.valor));
        botao.addEventListener("click", () => {
            rascunho.categoriaTecnica = opcao.valor;
            renderizarCategoriasTecnicas();
            esconderErro();
        });
        container.appendChild(botao);
    });
}

function renderizarOpcoesTexto(idContainer, opcoes, campoAvatar) {
    const container = document.getElementById(idContainer);
    container.replaceChildren();

    opcoes.forEach(opcao => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "opcao-chip";
        botao.textContent = opcao.nome;
        botao.classList.toggle("selecionada", rascunho.avatar[campoAvatar] === opcao.id);
        botao.setAttribute("aria-pressed", String(rascunho.avatar[campoAvatar] === opcao.id));
        botao.addEventListener("click", () => {
            rascunho.avatar[campoAvatar] = opcao.id;
            renderizarOpcoesTexto(idContainer, opcoes, campoAvatar);
            atualizarPreview();
        });
        container.appendChild(botao);
    });
}

function renderizarOpcoesCor(idContainer, opcoes, campoAvatar) {
    const container = document.getElementById(idContainer);
    container.replaceChildren();

    opcoes.forEach(opcao => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "opcao-cor";
        botao.style.setProperty("--cor-opcao", opcao.cor);
        botao.classList.toggle("selecionada", rascunho.avatar[campoAvatar] === opcao.id);
        botao.setAttribute("aria-label", opcao.nome);
        botao.setAttribute("aria-pressed", String(rascunho.avatar[campoAvatar] === opcao.id));
        botao.addEventListener("click", () => {
            rascunho.avatar[campoAvatar] = opcao.id;
            renderizarOpcoesCor(idContainer, opcoes, campoAvatar);
            atualizarPreview();
        });
        container.appendChild(botao);
    });
}

function atualizarEtapaCriador() {
    document.querySelectorAll(".etapa-criador").forEach(etapa => {
        etapa.classList.toggle("escondido", Number(etapa.dataset.etapa) !== etapaAtual);
    });

    document.getElementById("texto-progresso").textContent = `Etapa ${etapaAtual} de 3`;
    document.querySelectorAll(".passo").forEach(passo => {
        const numeroPasso = Number(passo.dataset.passo);
        passo.classList.toggle("ativo", numeroPasso === etapaAtual);
        passo.classList.toggle("concluido", numeroPasso < etapaAtual);
    });

    document.getElementById("botao-etapa-anterior").classList.toggle("escondido", etapaAtual === 1);
    document.getElementById("botao-proxima-etapa").classList.toggle("escondido", etapaAtual === 3);
    document.getElementById("botao-salvar-personagem").classList.toggle("escondido", etapaAtual !== 3);
    esconderErro();

    if (etapaAtual === 3) atualizarPreview();
}

function sincronizarRascunho() {
    rascunho.nome = document.getElementById("nome-personagem").value.trim();
    rascunho.administrativo = document.getElementById("participa-administrativo").checked;
}

function validarEtapa() {
    sincronizarRascunho();

    if (etapaAtual === 1 && rascunho.nome.length < 2) {
        mostrarErro("Digite um nome ou apelido com pelo menos 2 caracteres.");
        return false;
    }

    if (etapaAtual === 2 && !rascunho.administrativo && !rascunho.categoriaTecnica) {
        mostrarErro("Escolha Administrativo, uma categoria técnica ou os dois.");
        return false;
    }

    return true;
}

function proximaEtapa() {
    if (!validarEtapa()) return;
    etapaAtual = Math.min(3, etapaAtual + 1);
    atualizarEtapaCriador();
}

function etapaAnterior() {
    sincronizarRascunho();
    etapaAtual = Math.max(1, etapaAtual - 1);
    atualizarEtapaCriador();
}

function atualizarPreview() {
    sincronizarRascunho();
    const preview = document.getElementById("preview-avatar");
    preview.replaceChildren(criarAvatar(rascunho));

    const resumo = document.getElementById("resumo-personagem");
    resumo.replaceChildren();
    const nome = document.createElement("strong");
    nome.textContent = rascunho.nome;
    resumo.appendChild(nome);
    resumo.appendChild(document.createElement("br"));
    resumo.appendChild(document.createTextNode(resumoDasCategorias(rascunho)));
}

function mostrarErro(mensagem) {
    const erro = document.getElementById("erro-formulario");
    erro.textContent = mensagem;
    erro.classList.remove("escondido");
}

function esconderErro() {
    const erro = document.getElementById("erro-formulario");
    erro.textContent = "";
    erro.classList.add("escondido");
}

function gerarId(nome) {
    const nomeNormalizado = nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return `${nomeNormalizado || "perfil"}-${Date.now()}`;
}

function salvarNovoPersonagem(evento) {
    evento.preventDefault();
    sincronizarRascunho();

    if (rascunho.nome.length < 2 || (!rascunho.administrativo && !rascunho.categoriaTecnica)) {
        mostrarErro("Revise o nome e escolha pelo menos uma equipe.");
        return;
    }

    const novoPerfil = {
        id: gerarId(rascunho.nome),
        nome: rascunho.nome,
        administrativo: rascunho.administrativo,
        categoriaTecnica: rascunho.categoriaTecnica,
        avatar: { ...rascunho.avatar }
    };

    perfis.push(novoPerfil);
    salvarPerfis();
    renderizarPerfis();
    selecionarPerfil(novoPerfil.id);
}

function comecarUso() {
    if (!perfilSelecionado) return;

    inicioUso = new Date();
    const horario = inicioUso.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    document.getElementById("mensagem-uso").textContent =
        `${perfilSelecionado.nome} está usando a cafeteira.`;
    document.getElementById("horario-uso").textContent = `🕐 Começou às ${horario}`;
    mostrarTela("tela-em-uso");
}

function finalizarUso() {
    if (!perfilSelecionado || !inicioUso) return;

    document.getElementById("titulo-conclusao").textContent =
        `Obrigada, ${perfilSelecionado.nome}!`;
    mostrarTela("tela-conclusao");
}

function voltarAoInicio() {
    perfilSelecionado = null;
    inicioUso = null;
    renderizarPerfis();
    mostrarTela("tela-inicio");
}

function configurarEventos() {
    document.getElementById("botao-criar-perfil").addEventListener("click", abrirCriador);
    document.getElementById("botao-sair-criador").addEventListener("click", voltarAoInicio);
    document.getElementById("botao-voltar-perfis").addEventListener("click", voltarAoInicio);
    document.getElementById("botao-proxima-etapa").addEventListener("click", proximaEtapa);
    document.getElementById("botao-etapa-anterior").addEventListener("click", etapaAnterior);
    document.getElementById("formulario-personagem").addEventListener("submit", salvarNovoPersonagem);
    document.getElementById("botao-comecar-uso").addEventListener("click", comecarUso);
    document.getElementById("botao-finalizar-uso").addEventListener("click", finalizarUso);
    document.getElementById("botao-voltar-inicio").addEventListener("click", voltarAoInicio);
    document.getElementById("participa-administrativo").addEventListener("change", evento => {
        rascunho.administrativo = evento.target.checked;
        esconderErro();
    });
    document.getElementById("nome-personagem").addEventListener("input", esconderErro);
}

function inicializar() {
    salvarPerfis();
    configurarEventos();
    renderizarPerfis();
    renderizarOpcoesCriador();
}

inicializar();
