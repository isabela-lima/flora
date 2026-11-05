# Automatizar a rotina

Com a automação, você acorda e a aula já está pronta: com o tema do seu bloco
de estudo, os erros que vencem hoje e questões no formato da banca. A semana
se fecha sozinha e você é avisada quando sair edital ou retificação.

## O jeito fácil: peça ao assistente

Abra a pasta do Flora no app do Codex ou do Claude e digite:

```text
/automatizar
```

ou simplesmente “quero a aula pronta todo dia de manhã”. O assistente pergunta
seu horário e seus dias de estudo, cria as automações no próprio app, testa
preparando a aula de hoje e anota tudo em `Private/Automações.md`.

| Automação | Quando | O que faz |
| --- | --- | --- |
| Aula diária | dias de estudo, antes do primeiro bloco | prepara a [[Private/Aula de hoje\|Aula de hoje]] |
| Revisão semanal | uma vez por semana | resume a semana e sugere novas datas para revisões atrasadas |
| Aviso de edital | uma vez por semana | confere o portal oficial e avisa se saiu edital ou retificação |

As automações só avisam quando algo dá errado ou quando há novidade no edital.

## Calendário (opcional)

Se você usa um calendário que o assistente consegue ler, como o Google Agenda,
crie os blocos de estudo nele, com títulos como “Estudo — Português” ou
“Simulado”. A aula segue o tema e a duração do bloco. Sem calendário, a aula
segue as revisões vencidas e o plano.

## Fazer à mão (se preferir)

Os pedidos agendados ficam em `Sistema/Agente/automatizar.md`. Em resumo:

- **Codex:** crie uma automação diária com o pedido “No vault Flora em
  <sua pasta>, siga Sistema/Agente/aula.md para preparar a aula de hoje” e
  marque para avisar só quando falhar.
- **Claude:** peça “Agende uma tarefa diária às 6h que siga /aula neste vault”.
- **Linha de comando (avançado):** com o `cron` do macOS ou Linux
  (`crontab -e`), trocando o caminho pela sua pasta:

  ```cron
  0 6 * * 1-6 cd "$HOME/Flora" && claude -p "Siga Sistema/Agente/aula.md para preparar a aula de hoje."
  ```

  Para o Codex, troque o comando por
  `codex exec "Siga Sistema/Agente/aula.md para preparar a aula de hoje."`. No
  Windows, use o Agendador de Tarefas com o mesmo comando.

## Se der errado

A automação nunca apaga a última aula boa. Se a página estiver com data antiga,
use o [[Private/Plano B da aula|roteiro manual]] e peça no chat: “Prepare
novamente a aula de hoje”. Para pausar ou apagar uma automação, veja
`Private/Automações.md`.
