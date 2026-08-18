# Plano de desenvolvimento — Cafeteira Tamandutech

Este arquivo registra a ordem combinada para o projeto. Uma etapa só começa depois que o fluxo anterior estiver validado no site publicado.

## Etapa atual — Frontend básico

- [x] Fluxo de uso: perfil → vou usar → em uso → já limpei
- [x] Página inicial organizada em categoria → personagens
- [x] Criador de personagem dividido em etapas
- [x] Nome ou apelido do usuário
- [x] Regra de participação: Administrativo + no máximo uma categoria técnica
- [x] Personalização inicial: pele, cabelo, cor do cabelo e roupa
- [x] Salvamento temporário dos perfis no `localStorage`
- [x] Corrigir a separação entre avatar, nome e categoria nos cartões mobile
- [x] Ampliar para 12 cabelos com seletor anterior/próximo
- [x] Adicionar versões verde e branca do uniforme Tamandutech
- [x] Substituir o emoji de café por ícone próprio em pixel art
- [x] Preparar a beta sem personagens predefinidos e com armazenamento isolado
- [x] Corrigir blocos indevidos em tranças, coque e rabo de cavalo
- [x] Conter os detalhes dos uniformes dentro da camisa
- [x] Trocar o cenário por parede clara, sofá preto e troféus
- [x] Forçar o esquema de cores claro nos navegadores
- [x] Adicionar cabelo branco, mantendo a opção ruiva
- [x] Versionar CSS e JavaScript para impedir mistura de arquivos antigos em cache
- [x] Ocultar o aviso de sincronização quando a conexão estiver normal
- [x] Substituir o fundo externo do desktop por pixel art original da UFABC Santo André
- [x] Trocar o texto de participação de "equipes" para "categorias"
- [x] Separar a cor fixa dos sapatos da cor escolhida para o cabelo
- [x] Suavizar o formato das tranças e do rabo de cavalo sem blocos externos
- [x] Permitir editar e excluir apenas o personagem criado pelo mesmo usuário anônimo
- [x] Avisar quando o navegador já possui um personagem e impedir nomes repetidos
- [ ] Validar a experiência em celulares Android e iPhone
- [ ] Confirmar nomes e categorias reais dos integrantes
- [x] Evoluir o avatar provisório para um sprite original de corpo inteiro
- [ ] Refinar a arte final e ampliar roupas e acessórios após o teste beta

## Etapa 2 — Firebase Realtime Database

- [x] Definir a estrutura inicial de usuários e status
- [x] Criar o projeto Firebase e conectar a configuração Web
- [x] Ativar autenticação anônima e autorizar `tamandutech.github.io`
- [x] Criar o Realtime Database no plano Spark e publicar as regras
- [x] Preparar regras com autenticação anônima
- [x] Preparar migração dos perfis locais para o banco
- [x] Sincronizar os perfis em tempo real
- [x] Reservar a cafeteira com transação para impedir dois usos simultâneos
- [x] Sincronizar o estado da cafeteira em tempo real
- [x] Registrar início, fim, duração, categoria e confirmação de limpeza
- [x] Exibir o histórico compartilhado em uma janela dentro da interface
- [ ] Publicar no Firebase as regras de edição, exclusão e histórico desta revisão
- [ ] Validar o fluxo simultaneamente em dois celulares

## Etapa 3 — NFC e QR Code

- [ ] Gerar e testar o QR Code com a URL pública
- [ ] Gravar a URL na tag NFC
- [ ] Testar abertura em Android e iPhone

## Etapa 4 — Notificações

- [ ] Escolher entre Web Push, Discord ou Telegram
- [ ] Implementar inscrição voluntária
- [ ] Notificar início de uso sem expor dados indevidos

## Etapa 5 — Arte, dashboard e gamificação

- [ ] Substituir avatares provisórios por pixel art original
- [ ] Criar histórico e dashboard administrativo
- [ ] Adicionar filtros, estatísticas e horários de pico
- [ ] Criar pontos, conquistas e ranking de limpeza

## Regra de categorias

Cada perfil pode ser:

- somente Administrativo;
- somente uma categoria técnica;
- Administrativo e uma categoria técnica.

Um perfil nunca pode participar de duas categorias técnicas ao mesmo tempo.
