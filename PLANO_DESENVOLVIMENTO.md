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
- [ ] Validar a experiência em celulares Android e iPhone
- [ ] Confirmar nomes e categorias reais dos integrantes
- [x] Evoluir o avatar provisório para um sprite original de corpo inteiro
- [ ] Produzir a arte final e ampliar cabelos, roupas e acessórios

## Etapa 2 — Firebase Realtime Database

- [ ] Definir a estrutura final de usuários, status e logs
- [ ] Configurar o projeto Firebase e as regras de segurança
- [ ] Migrar os perfis locais para o banco
- [ ] Sincronizar o estado da cafeteira em tempo real
- [ ] Registrar início, fim, duração, categoria e confirmação de limpeza
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
