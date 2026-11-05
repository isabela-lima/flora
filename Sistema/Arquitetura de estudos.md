# Arquitetura de estudos

O Flora trata a ALEPA como o primeiro módulo completo, não como a estrutura do
vault. O mesmo núcleo deve servir para concursos, cursos, certificações,
habilidades, assuntos livres e outros objetivos de aprendizagem.

## Princípio central

Markdown e frontmatter no vault são a fonte da verdade. Obsidian, agentes,
modelos de IA e ferramentas em TypeScript são interfaces substituíveis para
consultar ou atualizar esses arquivos; nenhum deles deve manter um segundo
cadastro canônico.

O núcleo não depende de Codex, Claude, Obsidian, Google Agenda ou outro
fornecedor. Calendários, modelos e agendadores entram por adaptadores. O mesmo
comando deve funcionar localmente, em outro agente ou em uma integração futura.

## Camadas

1. **Núcleo universal:** módulos, fontes, questões, sessões, erros, revisões e
   evidências de aprendizagem.
2. **Módulo:** objetivo, escopo, prazo, assuntos, critérios e, quando aplicável,
   instituição, cargo, edital e banca.
3. **Conteúdo:** conhecimento reutilizável, independente do módulo que motivou
   seu estudo.
4. **Estado pessoal:** desempenho, dificuldades, planejamento e revisões,
   mantidos em `Private/`.

## Contratos

Os contratos em `Schemas/` descrevem o frontmatter validado pelo MVP TypeScript
em `Tools/flora-validator/`. Eles não mudam o funcionamento atual do Obsidian e
não obrigam notas antigas a receber campos retroativamente.

Somente notas com uma propriedade `schema` versionada, como
`flora/questao@1`, entram na validação. Isso mantém registros legados válidos
durante a adoção gradual.

- `modulo.schema.json`: qualquer objetivo organizado de aprendizagem;
- `fonte.schema.json`: procedência e verificação do conteúdo;
- `questao.schema.json`: origem, confiança, resposta e vínculo com fontes.

Os modelos genéricos em `Templates/` podem ser usados manualmente para criar um
módulo, uma fonte ou uma questão sem depender da estrutura da ALEPA.

## Flora CLI

O MVP da CLI é somente leitura e não depende de plugins do Obsidian, calendário
ou IA. O pacote já se chama `flora-cli`; sua pasta permanece temporariamente em
`Tools/flora-validator/` até a interface estabilizar. A partir dela, execute:

- `npm run validate`: valida o vault e apresenta um resumo legível;
- `npm run validate -- --json`: retorna o relatório em JSON;
- `npm run sources -- --json`: lista fontes versionadas;
- `npm run questions -- --topic "assunto" --json`: seleciona questões
  conferidas e apoiadas apenas em fontes conferidas;
- `npm run daily-context -- --topic "assunto"`: monta um contexto determinístico
  com módulo, fontes e questões para qualquer gerador de aula;
- `npm test`: verifica os cenários automatizados;
- `npm run typecheck`: confere os tipos sem gerar arquivos.

Ele ignora notas legadas sem `schema`, os moldes em `Templates/` e configurações
internas do Obsidian. Nos registros versionados, confere os contratos, IDs
duplicados, referências a fontes e os metadados obrigatórios de questões
oficiais. Nenhum comando altera notas do vault.

## Automação agnóstica

O fluxo definitivo será `agendador → Flora CLI → adaptadores → vault`. O
agendador pode ser `launchd`, cron, GitHub Actions ou outro serviço. Calendário
e IA serão adaptadores opcionais; a CLI recebe contexto explícito e não importa
SDK de fornecedor no núcleo.

Hoje a automação é feita por agentes de IA que seguem as instruções em
`Sistema/Agente/` (veja `AGENTS.md`). Elas não definem o contrato do sistema:
qualquer agente ou agendador pode substituí-las sem migrar os registros do vault.

## Confiabilidade de questões

A ordem de preferência é:

1. oficial da banca relevante;
2. oficial de outra banca compatível;
3. adaptada de questão oficial;
4. autoral fundamentada em fontes verificadas.

Questões adaptadas ou autorais nunca podem ser apresentadas como oficiais. Uma
questão sem fonte suficiente permanece pendente e não deve alterar domínio,
status ou diagnóstico.

## Responsabilidades

- O calendário é a fonte dos horários.
- As notas guardam o estado e as evidências.
- Bases apresentam os dados sem duplicá-los.
- Templates ajudam na criação manual.
- Agentes selecionam, explicam e propõem alterações.
- Código determinístico valida esquemas, duplicações e escritas.

## Evolução

Novos módulos devem reutilizar o núcleo. Particularidades de uma prova ou curso
ficam na configuração do módulo, não nos templates e validadores universais.
ALEPA continua funcionando com a estrutura atual enquanto essa migração ocorre
gradualmente.
