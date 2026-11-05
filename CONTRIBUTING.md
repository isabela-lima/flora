# Como contribuir

Obrigado por ajudar! O Flora existe para ajudar estudantes de concurso, então
toda contribuição conta, inclusive de quem não programa.

## Jeitos de ajudar

- **Contar onde travou.** Instalou e não entendeu algo? Abra uma
  [issue](https://github.com/isabela-lima/flora/issues/new/choose). Isso é o que
  mais melhora o projeto.
- **Melhorar o método ou os textos.** Notas como `Comece aqui.md` e
  `Método de estudo.md` precisam ser claras para quem nunca usou o Obsidian.
- **Melhorar as instruções do assistente** em `AGENTS.md` e `Sistema/Agente/`.
  Teste a mudança com pelo menos um assistente e conte o resultado no PR.
- **Tema e painéis:** `.obsidian/themes/Flora/` e `.obsidian/snippets/`.
- **Validador:** `Tools/flora-validator/` (TypeScript).

As issues com o label `good first issue` são um bom começo.

## Fluxo de trabalho

1. Faça um fork e clone o seu fork.
2. Crie uma branch: `git switch -c docs/comece-aqui-mais-claro`.
3. Abra a pasta no Obsidian para ver o resultado. Na primeira vez, copie
   `.flora/privado/` para `Private/` (ou peça `/configurar` ao assistente).
4. Faça commits pequenos, no formato `tipo(escopo): descrição`
   (`feat`, `fix`, `docs`, `agente`, `tema`, `modulo`).
5. Se mexeu em fontes, questões ou no validador:

   ```bash
   cd Tools/flora-validator
   npm install
   npm test && npm run typecheck && npm run validate
   ```

6. Abra o pull request explicando o que mudou e como testou.

## Regras do projeto

- **Nada pessoal no Git.** Dados de estudo ficam em `Private/`, que é ignorada.
  O modelo dessa pasta, sem dados, fica em `.flora/privado/`.
- **Proveniência.** Fontes apontam para documentos oficiais; questões reais
  levam ao PDF oficial, sem transcrever enunciados.
- **Simples para estudantes.** Se uma mudança exige terminal ou configuração,
  ela vai para o nível 3 (automação), nunca para o caminho padrão.
- **Sem fornecedor obrigatório.** As instruções do assistente devem funcionar em
  qualquer agente que leia `AGENTS.md`.

## Publicar uma versão (mantenedores)

```bash
./Tools/empacotar.sh
```

Gera `dist/flora.zip` com os plugins do Obsidian já instalados e a pasta
`Private/` pronta. Anexe o zip a uma release no GitHub.
