# Firebase da Cafeteira Tamandutech

O frontend está conectado ao projeto `cafeteira-tamandutech` no Firebase Realtime Database. Se o serviço estiver temporariamente indisponível, o site mantém uma cópia local dos personagens no navegador.

## Serviços configurados

1. App Web **Cafeteira Tamandutech Web** registrado.
2. Realtime Database em `us-central1`, no plano Spark gratuito.
3. Authentication com o provedor **Anônimo** habilitado.
4. Domínio `tamandutech.github.io` autorizado no Firebase Authentication.
5. Regras básicas de `database.rules.json` publicadas; a revisão com edição, exclusão e histórico precisa ser republicada após o merge.

## Configuração do frontend

O objeto público fornecido pelo Firebase está em `firebase-config.js`:

```js
window.FIREBASE_CONFIG = { /* configuração pública do app Web */ };
```

Essa configuração identifica o app Web e não substitui as regras de segurança. As permissões ficam em `database.rules.json`.

## Estrutura do banco

```text
perfis/
  perfil-id/
    nome
    administrativo
    categoriaTecnica
    avatar
    criadorUid
    criadoEm
    atualizadoEm

estadoCafeteira/
  perfilId
  nome
  categorias
  inicioEm
  usuarioUid

historico/
  registro-id/
    perfilId
    nome
    categorias
    inicioEm
    fimEm
    duracaoMs
    limpezaConfirmada
    limpoPor
    usuarioUid
```

`estadoCafeteira` é reservado com uma transação. Se já houver um uso ativo, uma segunda reserva é rejeitada pelo cliente e pelas regras do banco.

Cada personagem carrega o `criadorUid` da autenticação anônima. As regras permitem alteração e exclusão somente quando esse UID é o mesmo que criou o registro. Na beta, isso identifica o navegador: ao limpar os dados do site ou trocar de aparelho, a pessoa recebe outro UID. Identidade permanente exigirá login por Google ou e-mail em uma etapa futura.
