# Como contribuir

Obrigado por ajudar! O Flora só é útil se cobrir o concurso de quem chega,
então **adicionar e conferir concursos** é a contribuição mais valiosa. Código,
documentação e adaptadores também são bem-vindos.

## Preparar o ambiente

```bash
git clone https://github.com/isabela-lima/flora.git
cd flora
npm install
npm test          # testes
npm run typecheck # tipos
npm run flora -- concursos   # roda a CLI sem npm link
```

## Fluxo de trabalho

1. Abra ou escolha uma [issue](https://github.com/isabela-lima/flora/issues).
   Para mudanças grandes, comente antes de começar.
2. Crie uma branch a partir da `main`: `git switch -c concurso/trt8-2027` ou
   `git switch -c feat/exportar-agenda`.
3. Faça commits pequenos, com mensagens no formato
   `tipo(escopo): descrição` (`feat`, `fix`, `docs`, `test`, `concurso`).
4. Rode `npm test` e `npm run typecheck`.
5. Abra um pull request. O CI roda os mesmos testes, e outra pessoa revisa
   antes do merge.

## Adicionar um concurso

Cada concurso é um arquivo JSON em [`concursos/`](concursos/). Os editores que
entendem JSON Schema (VS Code, por exemplo) autocompletam os campos.

1. Copie [`concursos/alepa-2026-analista-programacao.json`](concursos/alepa-2026-analista-programacao.json)
   para `concursos/<orgao>-<ano>-<cargo>.json`. O `id` dentro do arquivo deve
   ser igual ao nome do arquivo.
2. Preencha com o **edital vigente**:
   - `data_prova`, `orgao`, `cargo` e `banca`;
   - `fontes`: links oficiais para o edital, o conteúdo programático e cada
     retificação;
   - `disciplinas`: nome, número de questões na prova objetiva e os tópicos do
     conteúdo programático, agrupados em itens que caibam em uma ou duas
     sessões de estudo.
3. Deixe `"validacao": "pendente"`. Só marque `"conferida"`, com
   `verificado_em`, depois de comparar item a item com o edital e as
   retificações. De preferência, quem confere é uma segunda pessoa.
4. Teste: `npm test` valida todos os arquivos do catálogo, e
   `npm run flora -- iniciar /tmp/teste --concurso <id> --sem-perguntas` mostra
   o vault gerado.

Não copie o texto integral de provas ou apostilas: use links para os PDFs
oficiais. Um mesmo cargo com editais diferentes (por ano) vira arquivos
diferentes.

## Organização do código

```
src/cli.ts        comandos e mensagens
src/concurso.ts   catálogo e validação dos concursos
src/plan.ts       etapas e distribuição do tempo (puro, sem arquivos)
src/routine.ts    escolha das aulas do dia e revisões (puro)
src/vault.ts      leitura e escrita das notas Markdown
src/validate.ts   validação de fontes e questões versionadas
src/catalog.ts    seleção de questões conferidas
schemas/          contratos em JSON Schema
test/             testes com node:test
```

Regras que mantêm o projeto simples:

- **Markdown é a fonte da verdade.** Nada de banco de dados ou estado escondido;
  tudo o que a CLI sabe está em `flora.json` e nas notas.
- **O núcleo não depende de fornecedor.** Obsidian, calendários, agendadores e
  modelos de IA entram como adaptadores opcionais, fora de `src/plan.ts` e
  `src/routine.ts`.
- **Plano e rotina são determinísticos.** Mesma entrada, mesmo resultado, para
  que dê para testar.
- **Sem dependências novas** sem discutir antes numa issue.
