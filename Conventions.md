# Convenções do vault

## Nomes

- Use títulos claros e pesquisáveis.
- Prefira o nome real do assunto: `Normalização de banco de dados.md`.
- Evite nomes genéricos como `Anotação 1.md`, `Diversos.md` ou `Revisão.md`.
- Não use números ou datas no título, exceto quando a data for parte do registro,
  como em um simulado.

## Onde salvar

- Cada concurso, curso ou objetivo de aprendizagem relevante fica em uma pasta
  própria, com uma página de entrada de mesmo nome.
- Conteúdo ligado à prova atual fica no módulo `ALEPA/`; isso não torna o vault
  inteiro um vault da ALEPA.
- Explicações que continuam úteis depois da prova podem ser ligadas ou movidas
  para [[Conhecimento]].
- Registros repetitivos são uma nota cada, numa pasta do módulo. O Templater
  aplica o modelo sozinho ao criar a nota na pasta:

  | Pasta | Modelo |
  | --- | --- |
  | `Private/ALEPA/Erros/` | [[Templates/Erro\|Erro]] |
  | `Private/ALEPA/Simulados/` | [[Templates/Simulado\|Simulado]] |
  | `Private/ALEPA/Sessões/` | [[Templates/Sessão de estudo\|Sessão de estudo]] |
  | `Private/Revisões semanais/` | [[Templates/Revisão semanal\|Revisão semanal]] |

- Páginas como Caderno de erros, Revisões e Simulados não guardam dados: elas
  mostram Bases que leem essas notas. Cada informação fica em um lugar só.
- Anexos (imagens, PDFs) vão para `Private/Anexos/`; mova para uma pasta
  pública só o que puder ir ao GitHub.
- Material ainda não classificado fica em [[Private/Inbox|Inbox privado]] e deve
  ser processado na revisão semanal.

## Arquitetura universal

- A ALEPA é o primeiro módulo completo, não o limite do vault.
- Concursos, cursos, certificações, habilidades e assuntos livres usam o mesmo
  núcleo de módulos, fontes, questões, sessões, erros, revisões e evidências.
- Particularidades como edital, cargo, banca e data da prova pertencem ao módulo
  e não aos contratos universais.
- Os contratos para validação ficam em `Schemas/` e a visão geral em
  [[Sistema/Arquitetura de estudos|Arquitetura de estudos]].
- Notas existentes não precisam ser migradas sem uma necessidade concreta.

## Público e privado

- Estrutura, métodos, modelos e referências reutilizáveis podem ser versionados.
- Resultados, dificuldades, caderno de erros, planejamento real, capturas e
  informações pessoais ficam em `Private/`.
- A pasta `Private/` sincroniza com a sua nuvem (iCloud, Drive, Dropbox), mas é
  ignorada pelo Git.
- Nunca usar `git add -f` para publicar arquivos privados.

## Propriedades

Use propriedades somente quando ajudarem a filtrar ou decidir uma ação. Todas
as notas de um módulo usam os mesmos nomes:

| Propriedade | Uso |
| --- | --- |
| `tipo` | `disciplina`, `erro`, `simulado`, `sessao`, `aula-do-dia`, `modulo` |
| `modulo` | nome curto do módulo, como `ALEPA` |
| `disciplina` | nome da disciplina como está no edital |
| `assunto` | tópico específico |
| `status` | etapa ou situação (veja abaixo) |
| `dominio` | 0 a 5, baseado em questões, não em sensação de familiaridade |
| `data` | quando o registro aconteceu |
| `proxima_revisao` | única fonte da data de revisão; alimenta a fila |
| `itens`, `acertos` | resultado de sessões e simulados |

Valores de `status`:

- disciplinas: `diagnosticar`, `estudar`, `praticar`, `revisar` ou `manutenção`;
- erros: `ativo` ou `resolvido`;
- simulados: `planejado` ou `feito`.

Um módulo pode acrescentar propriedades próprias, como `concurso`, `cargo`,
`prova` ou `questoes`. Os tipos ficam em `.obsidian/types.json`, para que datas e
números funcionem nos Bases.

## Registro pelo chat

Aulas e notas de estudo são material de leitura: nada nelas pede que a pessoa
escreva, marque ou preencha. Os resultados são contados no chat (veja
`Sistema/Agente/registrar.md`), e o agente que receber a mensagem:

1. preenche `itens`, `acertos` e `proxima_revisao` na aula do dia, ou na cópia
   arquivada em `Private/ALEPA/Sessões/` se a aula já tiver sido arquivada;
2. escolhe a próxima revisão pela regra da própria aula ou do
   [[Método de estudo]];
3. cria uma nota em `Private/ALEPA/Erros/`, com o modelo de erro, para cada
   falha que possa se repetir, ou soma `evidencias` num erro existente e o marca
   como `resolvido` na segunda evidência;
4. atualiza `status` e `dominio` da disciplina quando houver evidência nova;
5. responde com um resumo curto do que registrou.

## Links

- Ligue uma nota ao painel do módulo e aos registros relacionados.
- Não crie listas de links apenas para aparentar organização.
- Ao renomear uma nota, deixe o Obsidian atualizar os links.

## Fontes

- Conteúdo legal e de edital deve apontar para a fonte oficial.
- Conteúdo técnico deve preferir documentação oficial, livros ou artigos
  confiáveis.
- Diferencie fato, interpretação e experiência pessoal.

## Questões e confiabilidade

A ordem de preferência é: questão oficial da banca relevante; questão oficial
de outra banca compatível; questão adaptada de uma oficial; questão autoral
fundamentada em fontes verificadas.

- Questões oficiais devem apontar para caderno e gabarito definitivo.
- Questões adaptadas ou autorais devem declarar sua origem sem ambiguidade.
- A IA pode formular uma questão, mas a resposta precisa ser demonstrável nas
  fontes registradas.
- Uma questão sem fonte suficiente permanece pendente e não altera domínio,
  status ou diagnóstico.
- Quando não houver questão oficial para um tópico, é permitido adaptar ou
  criar uma questão fundamentada, desde que as fontes confiáveis sejam citadas
  e conferidas.

## Visual

- O tema **Flora** fica em `.obsidian/themes/Flora/`. Edite `src/flora.css` e
  rode `python3 build.py` dentro da pasta; o `theme.css` é gerado com fontes e
  ilustrações embutidas, para funcionar igual no iPhone.
- Componentes de painel ficam em `.obsidian/snippets/flora-hub.css` e só valem
  em notas com `cssclasses: flora-dashboard` ou `flora-module`.
- Callouts disponíveis: `flora-hero`, `flora-focus`, `flora-stat`,
  `flora-private`, `flora-empty` e os cards `flora-card-*` (`study`,
  `knowledge`, `project`, `inbox`, `review`, `error`, `progress`, `sim`,
  `lesson`, `content`, `private`, `method`, `template`, `pt`, `law`, `logic`,
  `it`, `code`).
- Use cards para navegação, não para conteúdo de estudo; notas de conteúdo
  ficam em Markdown simples.

## Git

- Faça commits pequenos e descritivos.
- Revise `git diff` antes de enviar ao GitHub.
- Não versione estado de janelas, caches, plugins instalados ou temas baixados.
- Use um único serviço para a sincronização do dia a dia (iCloud, Drive,
  Dropbox ou Syncthing). O Git, se usado, registra versões a partir do computador.
