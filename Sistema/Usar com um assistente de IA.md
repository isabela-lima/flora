# Usar com um assistente de IA

Com um assistente, você só conversa: ele monta o módulo do seu concurso, prepara
a aula do dia e registra seus resultados nas notas.

## O que você precisa

- Esta pasta no seu computador (a mesma que você abriu no Obsidian).
- Um assistente de IA que consiga **abrir uma pasta e editar arquivos**. Por
  exemplo: Codex (da OpenAI, entra com a conta do ChatGPT), Claude (aba Code),
  Gemini CLI, Cursor ou GitHub Copilot. O chat comum do navegador não serve,
  porque não mexe nos arquivos do seu computador.

Todos funcionam do mesmo jeito: as instruções do Flora estão no arquivo
`AGENTS.md`, em texto simples, e qualquer assistente consegue segui-las.

## Passo a passo

1. Abra o app e escolha **abrir uma pasta** (ou “projeto”). Selecione a pasta do
   Flora.
2. Digite `/configurar` e responda às perguntas: concurso, cargo, data da prova
   e quanto tempo você tem por semana.
3. Confira com o edital a tabela de disciplinas que o assistente mostrar. Ele
   só marca os dados como conferidos depois disso.
4. Abra o Obsidian. O seu módulo aparece em [[Estudos]] e no painel
   [[Private/Dashboard|Hoje]].

## No dia a dia

| Você digita | O que acontece |
| --- | --- |
| `/aula` | a aula de hoje aparece em [[Private/Aula de hoje\|Aula de hoje]] |
| “acertei 7 de 10, errei crase” | o assistente registra a sessão, os erros e a próxima revisão |
| `/simulado` | planeja ou corrige um simulado |
| `/revisao-semanal` | fecha a semana e ajusta o foco |
| `/plano` | refaz o plano até a prova |
| `/banca` | mapeia o estilo e as provas antigas da banca |
| `/edital` | confere se saiu retificação |
| `/automatizar` | agenda a aula diária, a revisão semanal e o aviso de edital |

Você nunca precisa editar as notas à mão: leia a aula, responda de cabeça ou no
papel e conte o resultado no chat.

## Cuidados

- O assistente pode errar ao ler um edital. Sempre confira datas, disciplinas e
  número de questões com o PDF oficial.
- Questões marcadas como **autorais** foram criadas pelo assistente com base em
  fontes citadas. As **reais da banca** levam ao PDF oficial.
