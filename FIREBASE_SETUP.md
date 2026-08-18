# Firebase da Cafeteira Tamandutech

O frontend está conectado ao projeto `cafeteira-tamandutech` no Firebase Realtime Database. Se o serviço estiver temporariamente indisponível, o site mantém uma cópia local dos personagens no navegador.

## Serviços configurados

1. App Web **Cafeteira Tamandutech Web** registrado.
2. Realtime Database em `us-central1`, no plano Spark gratuito.
3. Authentication com o provedor **Anônimo** habilitado.
4. Domínio `tamandutech.github.io` autorizado no Firebase Authentication.
5. Regras de `database.rules.json` publicadas.

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

estadoCafeteira/
  perfilId
  nome
  categorias
  inicioEm
  usuarioUid
```

`estadoCafeteira` é reservado com uma transação. Se já houver um uso ativo, uma segunda reserva é rejeitada pelo cliente e pelas regras do banco.
