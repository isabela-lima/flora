# Automatizar a rotina

Para a aula ficar pronta toda manhã sem você pedir. Escolha **uma** opção. Em
todas, o pedido ao assistente é o mesmo:

```text
Siga /aula para preparar a aula de hoje no vault Flora desta pasta.
```

Se você usa um calendário que o assistente consegue ler, como o Google Agenda,
crie os blocos de estudo nele, com títulos como “Estudo — Português” ou
“Simulado”. A aula segue o tema e a duração do bloco. Sem calendário, a aula
segue as revisões vencidas e o plano.

## Codex (app para computador)

1. Abra a pasta do Flora no Codex.
2. Crie uma **automação** com o pedido acima.
3. Defina a frequência: todos os dias às 6h, por exemplo.
4. Avisos: só quando falhar.

## Claude (aba Code do app para computador)

1. Abra a pasta do Flora.
2. Peça: “Agende uma tarefa diária às 6h que siga /aula neste vault.”
3. Confira a tarefa na lista de tarefas agendadas do app.

## Qualquer assistente de linha de comando (avançado)

Com o `cron` do macOS ou Linux (`crontab -e`). Troque o caminho pela sua pasta:

```cron
0 6 * * * cd "$HOME/Flora" && claude -p "Siga /aula para preparar a aula de hoje."
```

Para o Codex, troque o comando por `codex exec "Siga /aula para preparar a aula de hoje."`.
No Windows, use o Agendador de Tarefas com o mesmo comando.

## Revisão semanal

Repita qualquer opção acima com o pedido `Siga /revisao-semanal.` aos domingos.

## Se der errado

A automação nunca apaga a última aula boa. Se a página estiver com data antiga,
use o [[Private/Plano B da aula|roteiro manual]] e peça no chat: “Prepare
novamente a aula de hoje”.
