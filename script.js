const CHAVE_PERFIS = "cafeteiraTamandutechPerfisBetaV1";
const CHAVE_PERFIL_PROPRIO = "cafeteiraTamandutechPerfilProprioV1";
const CHAVE_HISTORICO_LOCAL = "cafeteiraTamandutechHistoricoLocalV1";
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
let perfilEmEdicaoId = null;
let conexaoFirebase = null;
let estadoCafeteiraCompartilhado = null;
let historicoUso = carregarHistoricoLocal();
let sincronizacaoPerfisConcluida = false;

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

function carregarHistoricoLocal() {
    try {
        const historicoSalvo = JSON.parse(localStorage.getItem(CHAVE_HISTORICO_LOCAL));
        return Array.isArray(historicoSalvo) ? historicoSalvo : [];
    } catch (erro) {
        console.warn("Não foi possível carregar o histórico local.", erro);
        return [];
    }
}

function salvarHistoricoLocal() {
    try {
        localStorage.setItem(CHAVE_HISTORICO_LOCAL, JSON.stringify(historicoUso));
    } catch (erro) {
        console.warn("Não foi possível salvar o histórico local.", erro);
    }
}

function obterIdPerfilProprio() {
    try {
        return localStorage.getItem(CHAVE_PERFIL_PROPRIO);
    } catch (erro) {
        return null;
    }
}

function guardarIdPerfilProprio(idPerfil) {
    try {
        if (idPerfil) localStorage.setItem(CHAVE_PERFIL_PROPRIO, idPerfil);
        else localStorage.removeItem(CHAVE_PERFIL_PROPRIO);
    } catch (erro) {
        console.warn("Não foi possível registrar o personagem deste dispositivo.", erro);
    }
}

function normalizarNomeChave(nome) {
    return String(nome || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .replace(/\s+/g, " ")
        .trim();
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

function formatarDataHora(valor) {
    if (!valor) return "data não informada";
    return new Date(valor).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatarDuracao(duracaoMs) {
    const totalSegundos = Math.max(0, Math.round(Number(duracaoMs || 0) / 1000));
    if (totalSegundos < 60) return `${totalSegundos}s`;

    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    if (minutos < 60) return segundos ? `${minutos}min ${segundos}s` : `${minutos}min`;

    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return minutosRestantes ? `${horas}h ${minutosRestantes}min` : `${horas}h`;
}

function atualizarDisponibilidadeCafeteira() {
    const aviso = document.getElementById("aviso-cafeteira");
    const botao = document.getElementById("botao-comecar-uso");
    const textoBotao = document.getElementById("texto-botao-comecar");
    const estado = estadoCafeteiraCompartilhado;
    const botaoExcluir = document.getElementById("botao-excluir-perfil");

    if (botaoExcluir && perfilSelecionado) {
        botaoExcluir.disabled = Boolean(estado?.perfilId === perfilSelecionado.id);
    }

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
        criadorUid: typeof valor.criadorUid === "string" ? valor.criadorUid : null,
        criadoEm: Number(valor.criadoEm) || null,
        atualizadoEm: Number(valor.atualizadoEm) || null,
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
        criadoEm: perfil.criadoEm || Date.now(),
        atualizadoEm: Date.now()
    };
}

async function salvarPerfilNoFirebase(perfil) {
    if (!conexaoFirebase) return true;

    const { database, ref, set } = conexaoFirebase;
    atualizarStatusSincronizacao("conectando", "Sincronizando personagem…");

    try {
        await set(ref(database, `perfis/${perfil.id}`), prepararPerfilRemoto(perfil));
        atualizarStatusSincronizacao("online", "Personagens sincronizados em tempo real");
        return true;
    } catch (erro) {
        console.error("Não foi possível salvar o personagem.", erro);
        atualizarStatusSincronizacao("erro", "Não foi possível sincronizar o personagem");
        return false;
    }
}

function normalizarRegistroHistorico(valor, id) {
    if (!valor || typeof valor !== "object" || !valor.nome || !valor.inicioEm || !valor.fimEm) {
        return null;
    }

    return {
        id: String(valor.id || id),
        perfilId: String(valor.perfilId || ""),
        nome: String(valor.nome).slice(0, 24),
        categorias: String(valor.categorias || "Sem categoria"),
        inicioEm: Number(valor.inicioEm),
        fimEm: Number(valor.fimEm),
        duracaoMs: Math.max(0, Number(valor.duracaoMs) || Number(valor.fimEm) - Number(valor.inicioEm)),
        limpezaConfirmada: valor.limpezaConfirmada === true,
        limpoPor: String(valor.limpoPor || valor.nome).slice(0, 24),
        usuarioUid: typeof valor.usuarioUid === "string" ? valor.usuarioUid : null,
        sincronizado: valor.sincronizado !== false
    };
}

function aplicarHistoricoRemoto(valor) {
    const historicoRemoto = Object.entries(valor || {})
        .map(([id, registro]) => normalizarRegistroHistorico(registro, id))
        .filter(Boolean);
    const idsRemotos = new Set(historicoRemoto.map(registro => registro.id));
    const pendentesLocais = historicoUso.filter(registro =>
        registro.sincronizado === false && !idsRemotos.has(registro.id)
    );

    historicoUso = historicoRemoto
        .concat(pendentesLocais)
        .sort((a, b) => b.fimEm - a.fimEm);
    salvarHistoricoLocal();
    renderizarHistorico();
}

function aplicarPerfisRemotos(valor) {
    const perfisRemotos = Object.values(valor || {})
        .map(normalizarPerfilRemoto)
        .filter(Boolean);

    perfis = perfisRemotos;
    salvarPerfis();
    renderizarCategorias();
    atualizarPerfilProprio();
    if (categoriaAberta) renderizarPerfis();
    retomarUsoSeNecessario();
}

async function migrarPerfisLocais(perfisLocais) {
    const { database, ref, get, set } = conexaoFirebase;
    const idPerfilProprio = obterIdPerfilProprio();
    if (!idPerfilProprio) return;

    for (const perfil of perfisLocais.filter(item => item.id === idPerfilProprio)) {
        const referenciaPerfil = ref(database, `perfis/${perfil.id}`);
        const existente = await get(referenciaPerfil);
        if (!existente.exists()) {
            await set(referenciaPerfil, prepararPerfilRemoto(perfil));
        }
    }
}

async function migrarHistoricoPendente() {
    if (!conexaoFirebase) return;
    const { database, usuarioUid, ref, get, set } = conexaoFirebase;
    const pendentes = historicoUso.filter(registro => registro.sincronizado === false);

    for (const registro of pendentes) {
        try {
            const referenciaRegistro = ref(database, `historico/${registro.id}`);
            const existente = await get(referenciaRegistro);
            if (!existente.exists()) {
                const registroRemoto = { ...registro, usuarioUid };
                delete registroRemoto.sincronizado;
                await set(referenciaRegistro, registroRemoto);
            }
            registro.sincronizado = true;
            registro.usuarioUid = usuarioUid;
        } catch (erro) {
            console.warn("O histórico pendente continuará salvo neste dispositivo.", erro);
        }
    }
    salvarHistoricoLocal();
}

async function configurarSincronizacao() {
    const configuracao = window.FIREBASE_CONFIG;

    if (!configuracao?.apiKey || !configuracao?.databaseURL || !configuracao?.projectId) {
        sincronizacaoPerfisConcluida = true;
        document.getElementById("botao-criar-perfil").disabled = false;
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
            remove: databaseSdk.remove,
            push: databaseSdk.push,
            onValue: databaseSdk.onValue,
            runTransaction: databaseSdk.runTransaction
        };

        await migrarPerfisLocais(perfisLocais);
        await migrarHistoricoPendente();

        databaseSdk.onValue(databaseSdk.ref(database, "perfis"), snapshot => {
            aplicarPerfisRemotos(snapshot.val());
            sincronizacaoPerfisConcluida = true;
            document.getElementById("botao-criar-perfil").disabled = false;
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

        databaseSdk.onValue(databaseSdk.ref(database, "historico"), snapshot => {
            aplicarHistoricoRemoto(snapshot.val());
        }, erro => {
            console.error("Falha ao acompanhar o histórico.", erro);
            atualizarStatusSincronizacao("erro", "Sem conexão com o histórico de uso");
        });
    } catch (erro) {
        console.error("Não foi possível iniciar o Firebase.", erro);
        conexaoFirebase = null;
        sincronizacaoPerfisConcluida = true;
        document.getElementById("botao-criar-perfil").disabled = false;
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

function perfilPodeSerAlterado(perfil) {
    return Boolean(
        perfil &&
        conexaoFirebase?.usuarioUid &&
        perfil.criadorUid === conexaoFirebase.usuarioUid
    );
}

function obterPerfilProprio() {
    if (conexaoFirebase?.usuarioUid) {
        const perfilDoUid = perfis.find(perfil => perfil.criadorUid === conexaoFirebase.usuarioUid);
        if (perfilDoUid) return perfilDoUid;
    }

    const idLocal = obterIdPerfilProprio();
    return perfis.find(perfil => perfil.id === idLocal) || null;
}

function atualizarPerfilProprio() {
    const perfilProprio = obterPerfilProprio();
    const botaoCriar = document.getElementById("botao-criar-perfil");
    const aviso = document.getElementById("aviso-perfil-existente");

    if (perfilProprio) {
        guardarIdPerfilProprio(perfilProprio.id);
        botaoCriar.textContent = "☺ Ver meu personagem";
        aviso.textContent = `Você já criou ${perfilProprio.nome} neste navegador. Abra o perfil para editar ou excluir.`;
        aviso.classList.remove("escondido");
        return;
    }

    botaoCriar.textContent = "＋ Criar meu personagem";
    aviso.textContent = "";
    aviso.classList.add("escondido");
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

    const acoesDono = document.getElementById("acoes-perfil-dono");
    const podeAlterar = perfilPodeSerAlterado(perfilSelecionado);
    acoesDono.classList.toggle("escondido", !podeAlterar);
    document.getElementById("botao-excluir-perfil").disabled =
        Boolean(estadoCafeteiraCompartilhado?.perfilId === perfilSelecionado.id);

    mostrarTela("tela-perfil");
    atualizarDisponibilidadeCafeteira();
}

function abrirCriador(perfil = null) {
    perfilEmEdicaoId = perfil?.id || null;
    rascunho = perfil
        ? {
            nome: perfil.nome,
            administrativo: perfil.administrativo,
            categoriaTecnica: perfil.categoriaTecnica,
            avatar: { ...perfil.avatar }
        }
        : criarRascunho();
    etapaAtual = 1;
    document.getElementById("formulario-personagem").reset();
    document.getElementById("nome-personagem").value = rascunho.nome;
    document.getElementById("participa-administrativo").checked = rascunho.administrativo;
    document.getElementById("etiqueta-criador").textContent = perfil ? "Editar personagem" : "Novo personagem";
    document.getElementById("titulo-criador").textContent = perfil ? `Editar ${perfil.nome}` : "Crie seu perfil";
    document.getElementById("botao-salvar-personagem").textContent = perfil ? "Salvar alterações" : "Salvar personagem";
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


    if (etapaAtual === 1 && perfis.some(perfil =>
        perfil.id !== perfilEmEdicaoId &&
        normalizarNomeChave(perfil.nome) === normalizarNomeChave(rascunho.nome)
    )) {
        mostrarErro(`Já existe um personagem chamado ${rascunho.nome}. Escolha outro nome ou apelido.`);
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

function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    modal.classList.remove("escondido");
    document.body.style.overflow = "hidden";
    modal.querySelector("button")?.focus();
}

function fecharModal(idModal) {
    document.getElementById(idModal).classList.add("escondido");
    if (!document.querySelector(".modal-sobreposicao:not(.escondido)")) {
        document.body.style.overflow = "";
    }
}

function renderizarHistorico() {
    const lista = document.getElementById("lista-historico");
    if (!lista) return;

    lista.replaceChildren();
    const registrosOrdenados = [...historicoUso].sort((a, b) => b.fimEm - a.fimEm);
    document.getElementById("historico-vazio")
        .classList.toggle("escondido", registrosOrdenados.length > 0);

    registrosOrdenados.forEach(registro => {
        const item = document.createElement("li");
        item.className = "historico-item";

        const nome = document.createElement("strong");
        nome.textContent = registro.nome;

        const duracao = document.createElement("span");
        duracao.className = "historico-duracao";
        duracao.textContent = formatarDuracao(registro.duracaoMs);

        const detalhe = document.createElement("span");
        detalhe.className = "historico-detalhe";
        detalhe.textContent = registro.categorias;

        const data = document.createElement("span");
        data.className = "historico-data";
        data.textContent = `${formatarDataHora(registro.inicioEm)} · `;
        const limpeza = document.createElement("span");
        limpeza.className = "historico-limpeza";
        limpeza.textContent = registro.limpezaConfirmada
            ? `✓ limpeza confirmada por ${registro.limpoPor}`
            : "limpeza não confirmada";
        data.appendChild(limpeza);

        item.append(nome, duracao, detalhe, data);
        lista.appendChild(item);
    });
}

function abrirHistorico() {
    renderizarHistorico();
    abrirModal("modal-historico");
}

async function registrarHistoricoUso(perfil, inicioEm, fimEm) {
    const referenciaNova = conexaoFirebase
        ? conexaoFirebase.push(conexaoFirebase.ref(conexaoFirebase.database, "historico"))
        : null;
    const id = referenciaNova?.key || `uso-${fimEm}-${Math.random().toString(36).slice(2, 8)}`;
    const registro = {
        id,
        perfilId: perfil.id,
        nome: perfil.nome,
        categorias: resumoDasCategorias(perfil),
        inicioEm,
        fimEm,
        duracaoMs: Math.max(0, fimEm - inicioEm),
        limpezaConfirmada: true,
        limpoPor: perfil.nome,
        usuarioUid: conexaoFirebase?.usuarioUid || null,
        sincronizado: false
    };

    historicoUso = [registro, ...historicoUso.filter(item => item.id !== id)];
    salvarHistoricoLocal();
    renderizarHistorico();

    if (!conexaoFirebase || !referenciaNova) return false;

    try {
        const registroRemoto = { ...registro };
        delete registroRemoto.sincronizado;
        await conexaoFirebase.set(referenciaNova, registroRemoto);
        registro.sincronizado = true;
        salvarHistoricoLocal();
        return true;
    } catch (erro) {
        console.error("Não foi possível publicar o histórico de uso.", erro);
        atualizarStatusSincronizacao("erro", "Uso finalizado; histórico aguardando sincronização");
        return false;
    }
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

async function salvarPersonagem(evento) {
    evento.preventDefault();
    sincronizarRascunho();

    if (rascunho.nome.length < 2 || (!rascunho.administrativo && !rascunho.categoriaTecnica)) {
        mostrarErro("Revise o nome e escolha pelo menos uma categoria.");
        return;
    }

    const nomeDuplicado = perfis.find(perfil =>
        perfil.id !== perfilEmEdicaoId &&
        normalizarNomeChave(perfil.nome) === normalizarNomeChave(rascunho.nome)
    );
    if (nomeDuplicado) {
        etapaAtual = 1;
        atualizarEtapaCriador();
        mostrarErro(`Já existe um personagem chamado ${nomeDuplicado.nome}. Escolha outro nome ou apelido.`);
        return;
    }

    const perfilProprio = obterPerfilProprio();
    if (!perfilEmEdicaoId && perfilProprio) {
        mostrarErro(`Você já criou ${perfilProprio.nome} neste navegador. Edite o personagem existente.`);
        return;
    }

    const perfilAnterior = perfilEmEdicaoId
        ? perfis.find(perfil => perfil.id === perfilEmEdicaoId)
        : null;

    if (perfilAnterior && !perfilPodeSerAlterado(perfilAnterior)) {
        mostrarErro("Este personagem só pode ser alterado no navegador em que foi criado.");
        return;
    }

    const perfilSalvo = {
        id: perfilAnterior?.id || gerarId(rascunho.nome),
        nome: rascunho.nome,
        criadorUid: perfilAnterior?.criadorUid || conexaoFirebase?.usuarioUid || null,
        criadoEm: perfilAnterior?.criadoEm || Date.now(),
        administrativo: rascunho.administrativo,
        categoriaTecnica: rascunho.categoriaTecnica,
        avatar: { ...rascunho.avatar }
    };

    const botaoSalvar = document.getElementById("botao-salvar-personagem");
    botaoSalvar.disabled = true;
    const sincronizado = await salvarPerfilNoFirebase(perfilSalvo);
    botaoSalvar.disabled = false;

    if (!sincronizado) {
        mostrarErro("Não foi possível salvar no banco agora. Verifique a conexão e tente novamente.");
        return;
    }

    const indiceExistente = perfis.findIndex(perfil => perfil.id === perfilSalvo.id);
    if (indiceExistente >= 0) perfis[indiceExistente] = perfilSalvo;
    else perfis.push(perfilSalvo);

    guardarIdPerfilProprio(perfilSalvo.id);
    salvarPerfis();
    renderizarCategorias();
    renderizarPerfis();
    atualizarPerfilProprio();
    perfilEmEdicaoId = null;
    selecionarPerfil(perfilSalvo.id);
}

function editarPerfilSelecionado() {
    if (!perfilPodeSerAlterado(perfilSelecionado)) return;
    abrirCriador(perfilSelecionado);
}

function abrirConfirmacaoExclusao() {
    if (!perfilPodeSerAlterado(perfilSelecionado)) return;
    if (estadoCafeteiraCompartilhado?.perfilId === perfilSelecionado.id) return;

    document.getElementById("texto-exclusao").textContent =
        `O personagem ${perfilSelecionado.nome} será excluído. O histórico de uso continuará guardado.`;
    abrirModal("modal-exclusao");
}

async function excluirPerfilSelecionado() {
    if (!perfilPodeSerAlterado(perfilSelecionado)) return;
    if (estadoCafeteiraCompartilhado?.perfilId === perfilSelecionado.id) return;

    const perfilExcluido = perfilSelecionado;
    const botao = document.getElementById("botao-confirmar-exclusao");
    botao.disabled = true;

    try {
        if (conexaoFirebase) {
            const { database, ref, remove } = conexaoFirebase;
            await remove(ref(database, `perfis/${perfilExcluido.id}`));
        }
        perfis = perfis.filter(perfil => perfil.id !== perfilExcluido.id);
        guardarIdPerfilProprio(null);
        salvarPerfis();
        fecharModal("modal-exclusao");
        voltarAoInicio();
        atualizarPerfilProprio();
    } catch (erro) {
        console.error("Não foi possível excluir o personagem.", erro);
        document.getElementById("texto-exclusao").textContent =
            "Não foi possível excluir agora. Verifique a conexão e tente novamente.";
    } finally {
        botao.disabled = false;
    }
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
    const inicioEm = inicioUso.getTime();
    const fimEm = Date.now();

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
    await registrarHistoricoUso(perfilSelecionado, inicioEm, fimEm);
    document.getElementById("titulo-conclusao").textContent =
        `Obrigada, ${perfilSelecionado.nome}!`;
    mostrarTela("tela-conclusao");
    botao.disabled = false;
}

function voltarAoInicio() {
    perfilSelecionado = null;
    inicioUso = null;
    perfilEmEdicaoId = null;

    if (categoriaAberta) {
        document.getElementById("visao-categorias").classList.add("escondido");
        document.getElementById("visao-perfis-categoria").classList.remove("escondido");
        renderizarPerfis();
    } else {
        voltarParaCategorias();
    }

    mostrarTela("tela-inicio");
}

function abrirCriadorOuPerfilProprio() {
    const perfilProprio = obterPerfilProprio();
    if (perfilProprio) {
        selecionarPerfil(perfilProprio.id);
        return;
    }
    abrirCriador();
}

function configurarEventos() {
    document.getElementById("botao-criar-perfil").addEventListener("click", abrirCriadorOuPerfilProprio);
    document.getElementById("botao-voltar-categorias").addEventListener("click", voltarParaCategorias);
    document.getElementById("botao-sair-criador").addEventListener("click", voltarAoInicio);
    document.getElementById("botao-voltar-perfis").addEventListener("click", voltarAoInicio);
    document.getElementById("botao-proxima-etapa").addEventListener("click", proximaEtapa);
    document.getElementById("botao-etapa-anterior").addEventListener("click", etapaAnterior);
    document.getElementById("botao-cabelo-anterior").addEventListener("click", () => alterarCabelo(-1));
    document.getElementById("botao-cabelo-proximo").addEventListener("click", () => alterarCabelo(1));
    document.getElementById("formulario-personagem").addEventListener("submit", salvarPersonagem);
    document.getElementById("botao-editar-perfil").addEventListener("click", editarPerfilSelecionado);
    document.getElementById("botao-excluir-perfil").addEventListener("click", abrirConfirmacaoExclusao);
    document.getElementById("botao-confirmar-exclusao").addEventListener("click", excluirPerfilSelecionado);
    document.getElementById("botao-cancelar-exclusao").addEventListener("click", () => fecharModal("modal-exclusao"));
    document.getElementById("botao-abrir-historico").addEventListener("click", abrirHistorico);
    document.getElementById("botao-fechar-historico").addEventListener("click", () => fecharModal("modal-historico"));
    document.getElementById("botao-comecar-uso").addEventListener("click", comecarUso);
    document.getElementById("botao-finalizar-uso").addEventListener("click", finalizarUso);
    document.getElementById("botao-voltar-inicio").addEventListener("click", voltarAoInicio);
    document.getElementById("participa-administrativo").addEventListener("change", evento => {
        rascunho.administrativo = evento.target.checked;
        esconderErro();
    });
    document.getElementById("nome-personagem").addEventListener("input", esconderErro);

    document.querySelectorAll(".modal-sobreposicao").forEach(modal => {
        modal.addEventListener("click", evento => {
            if (evento.target === modal) fecharModal(modal.id);
        });
    });

    document.addEventListener("keydown", evento => {
        if (evento.key !== "Escape") return;
        document.querySelectorAll(".modal-sobreposicao:not(.escondido)")
            .forEach(modal => fecharModal(modal.id));
    });
}

function inicializar() {
    salvarPerfis();
    configurarEventos();
    document.getElementById("botao-criar-perfil").disabled = Boolean(window.FIREBASE_CONFIG?.projectId);
    renderizarCategorias();
    renderizarOpcoesCriador();
    renderizarHistorico();
    atualizarPerfilProprio();
    atualizarDisponibilidadeCafeteira();
    void configurarSincronizacao();
}

inicializar();
