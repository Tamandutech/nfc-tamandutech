const CHAVE_PERFIS = "cafeteiraTamandutechPerfis";

const CATEGORIAS = [
    { nome: "Administrativo", icone: "📋", descricao: "Gestão e organização da equipe" },
    { nome: "Combate", icone: "⚙️", descricao: "Robôs de combate" },
    { nome: "Hockey", icone: "🏒", descricao: "Robôs jogadores de hockey" },
    { nome: "Sumô", icone: "🥋", descricao: "Robôs de sumô" },
    { nome: "Sumô LEGO", icone: "🧱", descricao: "Sumô construído com LEGO" },
    { nome: "Seguidor de Linha", icone: "〰️", descricao: "Robôs seguidores de linha" }
];

const CATEGORIAS_TECNICAS = CATEGORIAS
    .filter(categoria => categoria.nome !== "Administrativo")
    .map(categoria => categoria.nome);

const OPCOES_AVATAR = {
    peles: [
        { id: "pele-1", nome: "Pele 1", cor: "#f3c9a7", sombra: "#d99d7d", brilho: "#ffd9bc", bochecha: "#e89083" },
        { id: "pele-2", nome: "Pele 2", cor: "#d89a72", sombra: "#b96f50", brilho: "#eeb58d", bochecha: "#c76f69" },
        { id: "pele-3", nome: "Pele 3", cor: "#a96646", sombra: "#82452f", brilho: "#c9825d", bochecha: "#a9514e" },
        { id: "pele-4", nome: "Pele 4", cor: "#70402f", sombra: "#4d2a24", brilho: "#92553d", bochecha: "#7f3c3c" }
    ],
    cabelos: [
        { id: "curto", nome: "Curto" },
        { id: "longo", nome: "Longo" },
        { id: "cacheado", nome: "Cacheado" },
        { id: "raspado", nome: "Raspado" }
    ],
    coresCabelo: [
        { id: "castanho", nome: "Castanho", cor: "#5b392b", sombra: "#35251f", brilho: "#81543b" },
        { id: "preto", nome: "Preto", cor: "#27242b", sombra: "#17161c", brilho: "#4b4551" },
        { id: "loiro", nome: "Loiro", cor: "#d4a94f", sombra: "#9a7435", brilho: "#f0ca6d" },
        { id: "ruivo", nome: "Ruivo", cor: "#a84f31", sombra: "#713323", brilho: "#d06b3f" }
    ],
    roupas: [
        { id: "verde", nome: "Verde", cor: "#4d8b62", sombra: "#2f6548", brilho: "#76af7e" },
        { id: "azul", nome: "Azul", cor: "#477ca6", sombra: "#315476", brilho: "#6ba6c9" },
        { id: "vermelha", nome: "Vermelha", cor: "#a8463b", sombra: "#722f2c", brilho: "#d06452" },
        { id: "amarela", nome: "Amarela", cor: "#d5a93f", sombra: "#95712f", brilho: "#efca60" }
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
let categoriaAberta = null;
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
    personagem.className = `avatar-sprite cabelo-${avatar.cabelo}`;
    personagem.style.setProperty("--pele", pele.cor);
    personagem.style.setProperty("--pele-sombra", pele.sombra);
    personagem.style.setProperty("--pele-brilho", pele.brilho);
    personagem.style.setProperty("--bochecha", pele.bochecha);
    personagem.style.setProperty("--cabelo", corCabelo.cor);
    personagem.style.setProperty("--cabelo-sombra", corCabelo.sombra);
    personagem.style.setProperty("--cabelo-brilho", corCabelo.brilho);
    personagem.style.setProperty("--roupa", roupa.cor);
    personagem.style.setProperty("--roupa-sombra", roupa.sombra);
    personagem.style.setProperty("--roupa-brilho", roupa.brilho);

    [
        "sombra-sprite",
        "cabelo-fundo-sprite",
        "perna-sprite perna-esquerda",
        "perna-sprite perna-direita",
        "sapato-sprite sapato-esquerdo",
        "sapato-sprite sapato-direito",
        "braco-sprite braco-esquerdo",
        "braco-sprite braco-direito",
        "corpo-sprite",
        "gola-sprite gola-esquerda",
        "gola-sprite gola-direita",
        "emblema-sprite",
        "pescoco-sprite",
        "orelha-sprite orelha-esquerda",
        "orelha-sprite orelha-direita",
        "rosto-sprite",
        "cabelo-topo-sprite",
        "franja-sprite",
        "sobrancelha-sprite sobrancelha-esquerda",
        "sobrancelha-sprite sobrancelha-direita",
        "olho-sprite olho-esquerdo",
        "olho-sprite olho-direito",
        "nariz-sprite",
        "bochecha-sprite bochecha-esquerda",
        "bochecha-sprite bochecha-direita",
        "boca-sprite"
    ]
        .forEach(classes => {
            const parte = document.createElement("span");
            parte.className = classes;
            personagem.appendChild(parte);
        });

    container.appendChild(personagem);
    return container;
}

function perfilPertenceCategoria(perfil, categoria) {
    if (categoria === "Administrativo") return perfil.administrativo;
    return perfil.categoriaTecnica === categoria;
}

function renderizarCategorias() {
    const lista = document.getElementById("lista-categorias");
    lista.replaceChildren();

    CATEGORIAS.forEach(categoria => {
        const quantidade = perfis.filter(perfil => perfilPertenceCategoria(perfil, categoria.nome)).length;
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "categoria-card";

        const icone = document.createElement("span");
        icone.className = "categoria-card-icone";
        icone.textContent = categoria.icone;
        botao.appendChild(icone);

        const textos = document.createElement("span");
        textos.className = "categoria-card-textos";
        const nome = document.createElement("strong");
        nome.textContent = categoria.nome;
        const descricao = document.createElement("small");
        descricao.textContent = categoria.descricao;
        textos.appendChild(nome);
        textos.appendChild(descricao);
        botao.appendChild(textos);

        const contador = document.createElement("span");
        contador.className = "categoria-contador";
        contador.textContent = `${quantidade}`;
        contador.setAttribute("aria-label", `${quantidade} personagens`);
        botao.appendChild(contador);

        botao.addEventListener("click", () => abrirCategoria(categoria.nome));
        lista.appendChild(botao);
    });
}

function abrirCategoria(nomeCategoria) {
    categoriaAberta = nomeCategoria;
    const categoria = CATEGORIAS.find(item => item.nome === nomeCategoria);
    document.getElementById("icone-categoria").textContent = categoria.icone;
    document.getElementById("titulo-categoria").textContent = categoria.nome;
    document.getElementById("visao-categorias").classList.add("escondido");
    document.getElementById("visao-perfis-categoria").classList.remove("escondido");
    renderizarPerfis();
}

function voltarParaCategorias() {
    categoriaAberta = null;
    document.getElementById("visao-perfis-categoria").classList.add("escondido");
    document.getElementById("visao-categorias").classList.remove("escondido");
    renderizarCategorias();
}

function renderizarPerfis() {
    const lista = document.getElementById("lista-perfis");
    lista.replaceChildren();

    const perfisDaCategoria = categoriaAberta
        ? perfis.filter(perfil => perfilPertenceCategoria(perfil, categoriaAberta))
        : [];

    document.getElementById("mensagem-sem-perfis")
        .classList.toggle("escondido", perfisDaCategoria.length > 0);

    perfisDaCategoria.forEach(perfil => {
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
    renderizarCategorias();
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

    if (categoriaAberta) {
        document.getElementById("visao-categorias").classList.add("escondido");
        document.getElementById("visao-perfis-categoria").classList.remove("escondido");
        renderizarPerfis();
    } else {
        voltarParaCategorias();
    }

    mostrarTela("tela-inicio");
}

function configurarEventos() {
    document.getElementById("botao-criar-perfil").addEventListener("click", abrirCriador);
    document.getElementById("botao-voltar-categorias").addEventListener("click", voltarParaCategorias);
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
    renderizarCategorias();
    renderizarOpcoesCriador();
}

inicializar();
