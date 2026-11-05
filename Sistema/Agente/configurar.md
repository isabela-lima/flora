# /configurar — montar o módulo de um concurso

Transforma o concurso que a pessoa quer fazer num módulo completo, no mesmo
formato do módulo de exemplo `ALEPA/`. Faça uma pergunta por vez, em linguagem
simples.

## 1. Conversar

Pergunte, aceitando respostas aproximadas:

1. Qual concurso e qual cargo? (Ex.: “INSS, técnico do seguro social”.)
2. Já saiu edital? Se a pessoa tiver o link ou o PDF, peça.
3. Data da prova (ou “ainda não tem”).
4. Quantas horas por semana e em quais dias consegue estudar.
5. Usa algum calendário que você consiga ler? (Opcional.)
6. Quer manter o módulo de exemplo da ALEPA? (Recomende manter como referência,
   com `status: arquivado`, a menos que a pessoa vá fazer a ALEPA.)

## 2. Encontrar as fontes oficiais

Procure ao vivo o portal do concurso, o edital de abertura, o conteúdo
programático, o cronograma e todas as retificações. Use só sites oficiais (órgão
e banca). Para cada documento, crie uma nota em `<SIGLA>/Fontes/` no formato de
`ALEPA/Fontes/`, com `schema: flora/fonte@1` e `validacao: pendente`.

Se o edital ainda não saiu, use o edital anterior do mesmo cargo como
referência provisória, deixe isso claro na página do módulo e marque as fontes
como `desatualizada` quando o novo sair.

## 3. Criar o módulo público `<SIGLA>/`

Escolha uma sigla curta (órgão, sem espaços). Crie, seguindo os arquivos da ALEPA:

- `<SIGLA>/<SIGLA>.md` com `schema: flora/modulo@1`, `status: ativo`,
  `modulo: <SIGLA>`, cargo, banca, `prova` e `data_alvo`, a lista de
  `assuntos` e links para as fontes;
- `<SIGLA>/Conteúdo programático.md`, uma seção por disciplina com o número de
  questões e os tópicos agrupados em itens que caibam em uma ou duas sessões;
- `<SIGLA>/Prova.base`, copiado de `ALEPA/Prova.base` com o caminho trocado.

Mostre à pessoa a tabela de disciplinas, questões e pesos e peça que confira
com o PDF. Só depois disso marque as fontes como `conferida`, com
`verificado_em` e a página consultada.

## 4. Criar a parte pessoal `Private/<SIGLA>/`

Copie `.flora/privado/ALEPA/` para `Private/<SIGLA>/` e ajuste:

- troque `ALEPA` por `<SIGLA>` em todos os caminhos, links e filtros das Bases;
- crie uma nota por disciplina em `Disciplinas/`, com `disciplina`, `questoes`,
  `status: diagnosticar` e `dominio: 0`, apague as da ALEPA e atualize os cards
  do `Painel pessoal.md`;
- refaça as tabelas do `Progresso.md` com os tópicos do novo conteúdo
  programático, todos em `D`;
- no `Painel pessoal.md`, atualize cargo, data, horário e o peso da principal
  disciplina.

## 5. Ligar tudo

- `Private/Dashboard.md`: troque os caminhos da ALEPA pelos do novo módulo.
- `Home.md` e `Estudos.md`: adicione o card do novo módulo; se a ALEPA foi
  arquivada, mova o card dela para uma seção “Exemplo”.
- `.obsidian/plugins/templater-obsidian/data.json`: aponte `folder_templates`
  para `Private/<SIGLA>/Erros`, `Simulados` e `Sessões`.
- `.obsidian/plugins/obsidian-icon-folder/data.json`: repita os ícones da ALEPA
  para as pastas novas.

## 6. Fechar

Rode o validador se o Node estiver disponível. Depois rode `/plano` com as horas
e os dias informados e, se a banca tiver provas anteriores, sugira `/banca`.
Termine dizendo, em três linhas, o que foi criado, o que ainda precisa ser
conferido e como começar amanhã (`/aula`).
