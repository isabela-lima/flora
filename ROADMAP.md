# Roadmap

O Flora começou como o vault de uma pessoa estudando para um concurso (ALEPA
2026) e está virando uma ferramenta para qualquer pessoa organizar e automatizar
a própria rotina de estudos. Esta é a ordem de prioridade atual. Cada item vira
uma issue; comente antes de começar para não duplicar trabalho.

## Próximos passos

- [ ] **Estudar antes do edital.** Muita gente estuda meses antes de o edital
      sair. O `/configurar` deve aceitar três situações:
      - edital publicado (o fluxo atual);
      - concurso previsto: usa o último edital do mesmo órgão e cargo como base
        provisória;
      - meta ampla (por exemplo, “tribunais”, “área fiscal”, “carreiras
        jurídicas”): monta um núcleo comum a partir de editais recentes da
        área, com trilhas para o que é específico de cada carreira.
- [ ] **Plano sem data de prova.** Sem data, o plano vira um ciclo semanal de
      disciplinas pelo peso; com data, ganha as fases até a prova.
- [ ] **Quando o edital sair.** O `/edital` compara o conteúdo novo com o que
      já foi estudado, mantém o progresso dos tópicos que continuam e mostra o
      que falta. Aviso opcional quando o edital for publicado.
- [ ] **Vários módulos ao mesmo tempo** (por exemplo, ALEPA e TRT), com o
      painel Hoje somando as revisões de todos.
- [ ] **Quem já tem experiência não começa do zero.** O `/configurar` pergunta
      provas já feitas e pontos fortes e fracos, e estima o domínio inicial.
- [ ] **Entrada pelo assistente em conversa natural:** abrir a pasta e dizer
      “quero estudar para…”, sem precisar decorar comandos.
- [ ] **Guia passo a passo com capturas de tela** para quem usa o ChatGPT
      (app Codex com a mesma conta) e para quem usa o Claude.
- [ ] **Plano B só com o chat do ChatGPT:** um prompt para colar que gera a
      aula do dia, para quem não usa um app que edite arquivos.
- [ ] **Teste com estudantes que não programam**, observando sem ajudar e
      transformando cada trava em melhoria.

## Princípios

- **A meta da pessoa vem primeiro;** o edital entra quando sair.
- **O edital oficial é a fonte:** dados conferidos na internet, em sites
  oficiais, com documento e página citados, e confirmados pela pessoa.
- **O estado vive nas notas** (Markdown e propriedades). Assistentes,
  automações e o Obsidian leem e escrevem nelas; nenhum é obrigatório.
- **O caminho padrão não exige terminal.**
