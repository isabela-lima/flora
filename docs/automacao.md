# Automatizar a rotina

O Flora é só uma linha de comando que lê e escreve Markdown. Qualquer coisa que
rode comandos pode automatizar a rotina. Escolha uma das opções abaixo, ou
combine várias.

## Gerar o dia toda manhã (cron)

Funciona no macOS e no Linux. Descubra o caminho do `flora` com `which flora` e
edite o crontab com `crontab -e`:

```cron
# Todo dia às 6h, atualiza ~/Estudos/Hoje.md
0 6 * * * cd "$HOME/Estudos" && /caminho/para/flora hoje --salvar
```

No Windows, use o Agendador de Tarefas com o mesmo comando.

## Com um assistente de IA

Qualquer assistente que execute comandos (Claude Code, Codex, ChatGPT com
terminal, etc.) pode conduzir a rotina. Um prompt de partida:

> Na pasta ~/Estudos, rode `flora hoje --json` e me apresente as revisões e as
> aulas do dia. Para cada aula, faça perguntas de recuperação ativa sem me
> mostrar a teoria antes. Quando eu disser quantas questões acertei, registre
> com `flora registrar --json` e me diga a próxima revisão. Não edite as notas
> à mão: use sempre a CLI.

O JSON de `flora hoje --json` traz a etapa, os dias até a prova, as revisões
vencidas e as aulas (disciplina, tópico, atividade, minutos e roteiro).

## Com o Obsidian

Abra a pasta do vault como um vault do Obsidian. As notas usam links Markdown
comuns e propriedades no frontmatter, então funcionam sem plugins. Para ver o
dia ao abrir o app, rode `flora hoje --salvar` pelo cron e fixe a nota `Hoje.md`.

## Sincronizar entre aparelhos

O vault é uma pasta comum: iCloud, Google Drive, Dropbox, Syncthing ou Git
funcionam. Use **um** serviço por vez para evitar conflitos.
