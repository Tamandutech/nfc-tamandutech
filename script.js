const CHAVE_PERFIS = "cafeteiraTamandutechPerfisBetaV1";
const VERSAO_FIREBASE = "12.16.0";

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
        { id: "raspado", nome: "Raspado" },
        { id: "ondulado", nome: "Ondulado" },
        { id: "coque", nome: "Coque" },
        { id: "afro", nome: "Afro" },
        { id: "moicano", nome: "Moicano" },
        { id: "trancas", nome: "Tranças" },
        { id: "rabo", nome: "Rabo de cavalo" },
        { id: "franja", nome: "Franja" },
        { id: "lateral", nome: "Lateral" }
    ],
    coresCabelo: [
        { id: "castanho", nome: "Castanho", cor: "#5b392b", sombra: "#35251f", brilho: "#81543b" },
        { id: "preto", nome: "Preto", cor: "#27242b", sombra: "#17161c", brilho: "#4b4551" },
        { id: "loiro", nome: "Loiro", cor: "#d4a94f", sombra: "#9a7435", brilho: "#f0ca6d" },
        { id: "ruivo", nome: "Ruivo", cor: "#a84f31", sombra: "#713323", brilho: "#d06b3f" },
        { id: "branco", nome: "Branco", cor: "#e9e7df", sombra: "#aaa9a5", brilho: "#fffdf7" }
    ],
    roupas: [
        { id: "verde", nome: "Casual verde", cor: "#4d8b62", sombra: "#2f6548", brilho: "#76af7e", detalhe: "#f1c75b" },
        { id: "azul", nome: "Casual azul", cor: "#477ca6", sombra: "#315476", brilho: "#6ba6c9", detalhe: "#f1c75b" },
        { id: "vermelha", nome: "Casual vermelha", cor: "#a8463b", sombra: "#722f2c", brilho: "#d06452", detalhe: "#f1c75b" },
        { id: "amarela", nome: "Casual amarela", cor: "#d5a93f", sombra: "#95712f", brilho: "#efca60", detalhe: "#f6edcf" },
        { id: "uniforme-verde", nome: "Uniforme verde", cor: "#145c39", sombra: "#0a3d29", brilho: "#2d8052", detalhe: "#f4f0df" },
        { id: "uniforme-branco", nome: "Uniforme branco", cor: "#f2f1e9", sombra: "#c9cec4", brilho: "#ffffff", detalhe: "#167044" }
    ]
};

const PERFIS_INICIAIS = [];

let perfis = carregarPerfis();
let perfilSelecionado = null;
let categoriaAberta = null;
let inicioUso = null;
let etapaAtual = 1;
let rascunho = criarRascunho();
let conexaoFirebase = null;
let estadoCafeteiraCompartilhado = null;

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
        if (Array.isArray(perfisSalvos)) {
            return perfisSalvos;
        }
    } catch (erro) {
        console.warn("Não foi possível carregar os perfis locais.", erro);
    }

    return [...PERFIS_INICIAIS];
}

function salvarPerfis() {
    try {
        localStorage.setItem(CHAVE_PERFIS, JSON.stringify(perfis));
    } catch (erro) {
        console.warn("Não foi possível salvar os perfis localmente.", erro);
    }
}

function atualizarStatusSincronizacao(tipo, mensagem) {
    const status = document.getElementById("status-sincronizacao");
    status.className = `status-sincronizacao ${tipo}`;
    status.hidden = tipo !== "erro";
    document.getElementById("texto-sincronizacao").textContent = mensagem;
}

function formatarHorario(valor) {
    if (!valor) return "horário não informado";
    return new Date(valor).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function atualizarDisponibilidadeCafeteira() {
    const aviso = document.getElementById("aviso-cafeteira");
    const botao = document.getElementById("botao-comecar-uso");
    const textoBotao = document.getElementById("texto-botao-comecar");
    const estado = estadoCafeteiraCompartilhado;

    aviso.classList.toggle("escondido", !estado);

    if (!estado) {
        botao.disabled = false;
        textoBotao.textContent = "Vou usar a cafeteira";
        return;
    }

    document.getElementById("titulo-aviso-cafeteira").textContent =
        `Cafeteira em uso por ${estado.nome}`;
    document.getElementById("detalhe-aviso-cafeteira").textContent =
        `${estado.categorias} · desde ${formatarHorario(estado.inicioEm)}`;
    botao.disabled = true;
    textoBotao.textContent = `Em uso por ${estado.nome}`;
}

function normalizarPerfilRemoto(valor) {
    if (!valor || typeof valor !== "object" || !valor.id || !valor.nome || !valor.avatar) {
        return null;
    }

    return {
        id: String(valor.id),
        nome: String(valor.nome).slice(0, 24),
        administrativo: Boolean(valor.administrativo),
        categoriaTecnica: CATEGORIAS_TECNICAS.includes(valor.categoriaTecnica)
            ? valor.categoriaTecnica
            : null,
        avatar: {
            pele: buscarOpcao("peles", valor.avatar.pele).id,
            cabelo: buscarOpcao("cabelos", valor.avatar.cabelo).id,
            corCabelo: buscarOpcao("coresCabelo", valor.avatar.corCabelo).id,
            roupa: buscarOpcao("roupas", valor.avatar.roupa).id
        }
    };
}

function prepararPerfilRemoto(perfil) {
    return {
        ...perfil,
        criadorUid: conexaoFirebase.usuarioUid,
        criadoEm: Date.now()
    };
}

async function publicarPerfilNoFirebase(perfil) {
    if (!conexaoFirebase) return;

    const { database, ref, set } = conexaoFirebase;
    atualizarStatusSincronizacao("conectando", "Sincronizando novo personagem…");

    try {
        await set(ref(database, `perfis/${perfil.id}`), prepararPerfilRemoto(perfil));
        atualizarStatusSincronizacao("online", "Personagens sincronizados em tempo real");
    } catch (erro) {
        console.error("Não foi possível publicar o personagem.", erro);
        atualizarStatusSincronizacao("erro", "Personagem salvo localmente; sincronização indisponível");
    }
}

function aplicarPerfisRemotos(valor) {
    const perfisRemotos = Object.values(valor || {})
        .map(normalizarPerfilRemoto)
        .filter(Boolean);

    perfis = perfisRemotos;
    salvarPerfis();
    renderizarCategorias();
    if (categoriaAberta) renderizarPerfis();
    retomarUsoSeNecessario();
}

async function migrarPerfisLocais(perfisLocais) {
    const { database, ref, get, set } = conexaoFirebase;

    for (const perfil of perfisLocais) {
        const referenciaPerfil = ref(database, `perfis/${perfil.id}`);
        const existente = await get(referenciaPerfil);
        if (!existente.exists()) {
            await set(referenciaPerfil, prepararPerfilRemoto(perfil));
        }
    }
}

async function configurarSincronizacao() {
    const configuracao = window.FIREBASE_CONFIG;

    if (!configuracao?.apiKey || !configuracao?.databaseURL || !configuracao?.projectId) {
        atualizarStatusSincronizacao("local", "Personagens salvos neste dispositivo");
        return;
    }

    atualizarStatusSincronizacao("conectando", "Conectando os personagens…");

    try {
        const [appSdk, authSdk, databaseSdk] = await Promise.all([
            import(`https://www.gstatic.com/firebasejs/${VERSAO_FIREBASE}/firebase-app.js`),
            import(`https://www.gstatic.com/firebasejs/${VERSAO_FIREBASE}/firebase-auth.js`),
            import(`https://www.gstatic.com/firebasejs/${VERSAO_FIREBASE}/firebase-database.js`)
        ]);
        const app = appSdk.initializeApp(configuracao);
        const autenticacao = authSdk.getAuth(app);
        const credencial = await authSdk.signInAnonymously(autenticacao);
        const database = databaseSdk.getDatabase(app);
        const perfisLocais = [...perfis];

        conexaoFirebase = {
            database,
            usuarioUid: credencial.user.uid,
            ref: databaseSdk.ref,
            get: databaseSdk.get,
            set: databaseSdk.set,
            onValue: databaseSdk.onValue,
            runTransaction: databaseSdk.runTransaction
        };

        await migrarPerfisLocais(perfisLocais);

        databaseSdk.onValue(databaseSdk.ref(database, "perfis"), snapshot => {
            aplicarPerfisRemotos(snapshot.val());
            atualizarStatusSincronizacao("online", "Personagens sincronizados em tempo real");
        }, erro => {
            console.error("Falha ao acompanhar os personagens.", erro);
            atualizarStatusSincronizacao("erro", "Sem conexão; mostrando a última cópia salva");
        });

        databaseSdk.onValue(databaseSdk.ref(database, "estadoCafeteira"), snapshot => {
            estadoCafeteiraCompartilhado = snapshot.val();
            atualizarDisponibilidadeCafeteira();
            retomarUsoSeNecessario();
        });
    } catch (erro) {
        console.error("Não foi possível iniciar o Firebase.", erro);
        conexaoFirebase = null;
        atualizarStatusSincronizacao("erro", "Sem conexão; personagens salvos neste dispositivo");
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
    personagem.className = `avatar-sprite cabelo-${avatar.cabelo} roupa-${avatar.roupa}`;
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
    personagem.style.setProperty("--roupa-detalhe", roupa.detalhe);

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
        "faixa-uniforme-sprite",
        "marca-uniforme-sprite",
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
    atualizarDisponibilidadeCafeteira();
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
    atualizarSeletorCabelo();
    renderizarOpcoesCor("opcoes-pele", OPCOES_AVATAR.peles, "pele");
    renderizarOpcoesCor("opcoes-cor-cabelo", OPCOES_AVATAR.coresCabelo, "corCabelo");
    renderizarOpcoesRoupa();
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

function alterarCabelo(direcao) {
    const indiceAtual = OPCOES_AVATAR.cabelos
        .findIndex(opcao => opcao.id === rascunho.avatar.cabelo);
    const total = OPCOES_AVATAR.cabelos.length;
    const proximoIndice = (indiceAtual + direcao + total) % total;
    rascunho.avatar.cabelo = OPCOES_AVATAR.cabelos[proximoIndice].id;
    atualizarSeletorCabelo();
    atualizarPreview();
}

function atualizarSeletorCabelo() {
    const indice = Math.max(0, OPCOES_AVATAR.cabelos
        .findIndex(opcao => opcao.id === rascunho.avatar.cabelo));
    document.getElementById("nome-cabelo").textContent = OPCOES_AVATAR.cabelos[indice].nome;
    document.getElementById("contador-cabelo").textContent = `${indice + 1} de ${OPCOES_AVATAR.cabelos.length}`;
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

function renderizarOpcoesRoupa() {
    const container = document.getElementById("opcoes-roupa");
    container.replaceChildren();

    OPCOES_AVATAR.roupas.forEach(opcao => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "opcao-roupa";
        botao.classList.toggle("selecionada", rascunho.avatar.roupa === opcao.id);
        botao.setAttribute("aria-pressed", String(rascunho.avatar.roupa === opcao.id));

        const amostra = document.createElement("span");
        amostra.className = `amostra-roupa ${opcao.id.startsWith("uniforme-") ? opcao.id : ""}`.trim();
        amostra.style.setProperty("--cor-opcao", opcao.cor);
        amostra.style.setProperty("--cor-detalhe", opcao.detalhe);
        const nome = document.createElement("span");
        nome.textContent = opcao.nome;
        botao.append(amostra, nome);

        botao.addEventListener("click", () => {
            rascunho.avatar.roupa = opcao.id;
            renderizarOpcoesRoupa();
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
    void publicarPerfilNoFirebase(novoPerfil);
    selecionarPerfil(novoPerfil.id);
}

async function reservarCafeteira(perfil) {
    const inicioEm = Date.now();

    if (!conexaoFirebase) {
        return { sucesso: true, inicioEm };
    }

    const { database, ref, runTransaction, usuarioUid } = conexaoFirebase;
    const resultado = await runTransaction(
        ref(database, "estadoCafeteira"),
        estadoAtual => {
            if (estadoAtual) return;

            return {
                perfilId: perfil.id,
                nome: perfil.nome,
                categorias: resumoDasCategorias(perfil),
                inicioEm,
                usuarioUid
            };
        },
        { applyLocally: false }
    );

    return {
        sucesso: resultado.committed,
        inicioEm,
        estado: resultado.snapshot.val()
    };
}

async function liberarCafeteira() {
    if (!conexaoFirebase) return true;

    const { database, ref, runTransaction, usuarioUid } = conexaoFirebase;
    const resultado = await runTransaction(
        ref(database, "estadoCafeteira"),
        estadoAtual => {
            if (!estadoAtual) return null;
            if (estadoAtual.usuarioUid !== usuarioUid) return;
            return null;
        },
        { applyLocally: false }
    );

    return resultado.committed;
}

function preencherTelaEmUso() {
    if (!perfilSelecionado || !inicioUso) return;

    document.getElementById("mensagem-uso").textContent =
        `${perfilSelecionado.nome} está usando a cafeteira.`;
    document.getElementById("horario-uso").textContent =
        `Início: ${formatarHorario(inicioUso.getTime())}`;
}

function retomarUsoSeNecessario() {
    if (!conexaoFirebase || !estadoCafeteiraCompartilhado || inicioUso) return;
    if (estadoCafeteiraCompartilhado.usuarioUid !== conexaoFirebase.usuarioUid) return;

    const perfilEmUso = perfis.find(perfil => perfil.id === estadoCafeteiraCompartilhado.perfilId);
    if (!perfilEmUso) return;

    perfilSelecionado = perfilEmUso;
    inicioUso = new Date(estadoCafeteiraCompartilhado.inicioEm);
    preencherTelaEmUso();
    mostrarTela("tela-em-uso");
}

async function comecarUso() {
    if (!perfilSelecionado) return;

    const botao = document.getElementById("botao-comecar-uso");
    botao.disabled = true;

    try {
        const reserva = await reservarCafeteira(perfilSelecionado);

        if (!reserva.sucesso) {
            estadoCafeteiraCompartilhado = reserva.estado;
            atualizarDisponibilidadeCafeteira();
            return;
        }

        inicioUso = new Date(reserva.inicioEm);
        if (conexaoFirebase) {
            estadoCafeteiraCompartilhado = reserva.estado;
            atualizarDisponibilidadeCafeteira();
        }
        preencherTelaEmUso();
        mostrarTela("tela-em-uso");
    } catch (erro) {
        console.error("Não foi possível reservar a cafeteira.", erro);
        document.getElementById("detalhe-aviso-cafeteira").textContent =
            "Não foi possível confirmar a disponibilidade. Tente novamente.";
        document.getElementById("aviso-cafeteira").classList.remove("escondido");
        botao.disabled = false;
    }
}

async function finalizarUso() {
    if (!perfilSelecionado || !inicioUso) return;

    const botao = document.getElementById("botao-finalizar-uso");
    botao.disabled = true;

    try {
        const liberada = await liberarCafeteira();
        if (!liberada) {
            document.getElementById("horario-uso").textContent =
                "Não foi possível liberar a cafeteira. Verifique a conexão e tente novamente.";
            botao.disabled = false;
            return;
        }
    } catch (erro) {
        console.error("Não foi possível liberar a cafeteira.", erro);
        document.getElementById("horario-uso").textContent =
            "Não foi possível liberar a cafeteira. Verifique a conexão e tente novamente.";
        botao.disabled = false;
        return;
    }

    estadoCafeteiraCompartilhado = null;
    atualizarDisponibilidadeCafeteira();
    document.getElementById("titulo-conclusao").textContent =
        `Obrigada, ${perfilSelecionado.nome}!`;
    mostrarTela("tela-conclusao");
    botao.disabled = false;
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
    document.getElementById("botao-cabelo-anterior").addEventListener("click", () => alterarCabelo(-1));
    document.getElementById("botao-cabelo-proximo").addEventListener("click", () => alterarCabelo(1));
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
    atualizarDisponibilidadeCafeteira();
    void configurarSincronizacao();
}

inicializar();
