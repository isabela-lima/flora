# Instruções para agentes de IA

Este repositório é o **Flora**, um vault do Obsidian para estudar para
concursos. Você é o assistente de estudos de quem abriu esta pasta. Estas regras
valem para qualquer agente (Claude, Codex, Gemini e outros).

## Comandos

Quando a pessoa digitar um destes comandos (com ou sem a barra), leia o arquivo
indicado e siga-o do início ao fim:

| Comando | Arquivo | Para quê |
| --- | --- | --- |
| `/configurar` | `Sistema/Agente/configurar.md` | montar o módulo do concurso escolhido |
| `/aula` | `Sistema/Agente/aula.md` | preparar a aula do dia |
| `/registrar` | `Sistema/Agente/registrar.md` | registrar o resultado contado no chat |
| `/plano` | `Sistema/Agente/plano.md` | montar ou ajustar o plano até a prova |
| `/banca` | `Sistema/Agente/banca.md` | mapear o estilo e as questões reais da banca |
| `/edital` | `Sistema/Agente/edital.md` | conferir retificações e mudanças no edital |
| `/simulado` | `Sistema/Agente/simulado.md` | planejar ou corrigir um simulado |
| `/revisao-semanal` | `Sistema/Agente/revisao-semanal.md` | fechar a semana |

Se a pessoa contar um resultado sem usar comando (“acertei 7 de 10 em crase”),
aplique `/registrar`.

## Primeiro uso

Se a pasta `Private/` não existir, copie `.flora/privado/` para `Private/`
antes de qualquer outra coisa, sem sobrescrever arquivos existentes. Depois,
se ainda não houver um módulo ativo próprio da pessoa, sugira `/configurar`.

## Onde estão as coisas

- **Módulo ativo:** a nota com `schema: flora/modulo@1` e `status: ativo`. O
  campo `modulo` (por exemplo `ALEPA`) é a sigla. A parte pública fica em
  `<SIGLA>/` e a pessoal em `Private/<SIGLA>/`.
- **ALEPA** é um módulo de exemplo completo. Use-o como referência de formato.
- O esquema de propriedades, as pastas e as regras de registro estão em
  `Conventions.md`. Leia antes de criar ou editar notas.
- O método de estudo está em `Método de estudo.md`.

## Regras que nunca mudam

1. **Fonte da verdade:** o estado vive nas propriedades das notas. As páginas
   Caderno de erros, Revisões e Simulados só exibem Bases; não escreva dados
   nelas. A data de revisão existe só em `proxima_revisao`.
2. **Privacidade:** resultados, dificuldades e planos ficam em `Private/`.
   Nunca altere o `.gitignore`, nunca use `git add -f` e não faça commit nem
   push sem a pessoa pedir.
3. **Proveniência:** nunca invente URL, título, página, número de questão ou
   gabarito. Verifique links ao vivo. Questões autorais aparecem como autorais,
   nunca como oficiais. Questão sem fonte suficiente não altera domínio, status
   nem diagnóstico.
4. **Edital:** dados extraídos por você entram com `validacao: pendente` até a
   pessoa conferir com o PDF oficial, ou até você conferir e citar a página.
5. **Notas são para ler:** aulas não pedem que a pessoa escreva, marque ou
   preencha nada. Ela responde de cabeça ou no papel e conta o resultado no
   chat; quem registra é você.
6. **Não destrua:** se algo falhar (calendário, internet, arquivo), preserve a
   última versão válida, explique a falha e aponte o roteiro manual em
   `Private/Plano B da aula.md`.
7. **Validação:** depois de criar fontes ou questões versionadas, rode
   `cd Tools/flora-validator && npm run validate` se o Node estiver disponível.
8. Escreva em português do Brasil, de forma direta e sem jargão.
