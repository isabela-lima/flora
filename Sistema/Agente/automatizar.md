# /automatizar — deixar a rotina acontecer sozinha

Configure as automações da pessoa no app em que você está rodando, para a aula
ficar pronta antes do primeiro bloco de estudo. A pessoa não deve precisar
mexer em configurações: você pergunta, cria, testa e explica.

## 1. Conversar

Pergunte, uma coisa por vez:

1. **Que horas costuma começar a estudar?** A aula diária roda pelo menos
   30 minutos antes (padrão: 6h).
2. **Em quais dias estuda?** (Padrão: segunda a sábado.)
3. **Usa algum calendário para os blocos de estudo?** Só conte com ele se você
   conseguir lê-lo neste app (por exemplo, uma integração com o Google Agenda).
   Se não houver, a aula segue as revisões vencidas e o plano, e isso funciona
   bem.
4. **Quais automações quer?** Recomende as três:
   - **Aula diária** (essencial);
   - **Revisão semanal**, no domingo ou no último dia de estudo;
   - **Aviso de edital**, semanal: confere o portal oficial e avisa quando sair
     edital ou retificação. Recomende principalmente para quem estuda antes do
     edital.

## 2. Montar os pedidos

Use o caminho absoluto desta pasta (`<PASTA>`), porque a automação pode rodar
fora dela. Os pedidos agendados são exatamente estes:

| Automação | Frequência | Pedido |
| --- | --- | --- |
| Aula diária | dias de estudo, no horário combinado | `No vault Flora em <PASTA>, siga Sistema/Agente/aula.md para preparar a aula de hoje. Rode sem fazer perguntas. Não avise se der certo; avise só se não conseguir preparar, gravar ou validar a aula.` |
| Revisão semanal | 1 vez por semana | `No vault Flora em <PASTA>, siga Sistema/Agente/revisao-semanal.md no modo automático.` |
| Aviso de edital | 1 vez por semana | `No vault Flora em <PASTA>, siga Sistema/Agente/edital.md no modo vigilância.` |

## 3. Criar no app

Use a primeira opção disponível, nesta ordem:

1. **Ferramenta do próprio app** para criar automações, tarefas agendadas ou
   rotinas (o Codex e o Claude têm). Crie uma por automação, com nome claro
   (“Flora — aula diária”) e, se houver a opção, avisos só em caso de falha.
2. **Interface do app:** se você não puder criar sozinho, guie a pessoa passo a
   passo: onde clicar, qual nome dar, qual frequência escolher e o pedido exato
   para colar (copie da tabela acima, já com o caminho).
3. **Agendador do sistema** (`cron` no macOS ou Linux, Agendador de Tarefas no
   Windows), só se a pessoa preferir e houver um assistente de linha de comando
   instalado. Mostre a linha e peça confirmação antes de instalar.

Nunca crie automações que a pessoa não aprovou e não altere automações que já
existam para outros fins.

## 4. Testar na hora

Rode a aula diária agora, como se fosse a automação: prepare
`Private/Aula de hoje.md` seguindo `aula.md`. Mostre o resultado e confirme
que a pessoa consegue abrir a aula no Obsidian.

## 5. Registrar

Crie ou atualize `Private/Automações.md`, uma nota só de leitura para a pessoa,
com uma linha por automação: nome, app, frequência e horário, o pedido
agendado e a data em que foi criada. Inclua no fim:

- como pausar ou apagar cada automação no app usado;
- o que fazer se a aula não aparecer: abrir o
  [[Private/Plano B da aula|roteiro manual]] e pedir no chat “prepare novamente
  a aula de hoje”.

## 6. Fechar

Resuma em três linhas o que ficou agendado, quando a primeira aula automática
vai aparecer e como pedir ajuda se algo falhar.

## Regras das automações

- **Silêncio quando dá certo:** só avisar a pessoa em caso de falha ou de
  novidade relevante (edital, retificação).
- **Nunca destruir:** se calendário, internet ou vault falharem, preservar a
  última aula válida e explicar a falha.
- **Validar antes de terminar:** cada automação confere o próprio resultado
  (veja a seção “Validar” de `aula.md`).
- **Privacidade:** automações não fazem commit, push nem publicam nada.
