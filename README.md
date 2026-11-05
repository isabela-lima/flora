# Flora 🌸

Monte e automatize sua rotina de estudos para concursos. Você escolhe o
concurso, diz quanto tempo tem por semana, e o Flora cria um plano até a prova,
escolhe as aulas de cada dia e agenda as revisões conforme o seu desempenho.

Tudo fica em arquivos Markdown numa pasta sua. Dá para abrir no Obsidian, no VS
Code, no celular ou em qualquer editor de texto, e qualquer agendador ou
assistente de IA pode ler e atualizar a rotina pela linha de comando.

## Começar em 3 passos

Você precisa do [Node.js 22 ou mais novo](https://nodejs.org/) e do
[Git](https://git-scm.com/).

**1. Instale**

```bash
git clone https://github.com/isabela-lima/flora.git
cd flora
npm install
npm link
```

`npm link` deixa o comando `flora` disponível em qualquer pasta.

**2. Crie seu vault de estudos**

```bash
flora iniciar ~/Estudos
```

O Flora pergunta o concurso, a data de início, as horas por semana e os dias
em que você estuda. Ele cria:

```
~/Estudos/
├── flora.json        suas escolhas (concurso, horas, dias)
├── Concurso.md       cargo, disciplinas, pesos e fontes oficiais
├── Plano.md          etapas até a prova e tempo por disciplina
├── Disciplinas/      uma nota por disciplina, com os tópicos do edital
├── Sessões/          uma nota por sessão estudada
└── Erros/            erros que podem se repetir
```

Seu concurso não está na lista? Veja [como adicionar um concurso](CONTRIBUTING.md#adicionar-um-concurso).
Leva uns 15 minutos com o edital aberto.

**3. Estude**

```bash
cd ~/Estudos
flora hoje
```

O comando mostra as revisões vencidas e as aulas do dia, cada uma com um
roteiro de 45 minutos. Ao terminar, registre o resultado:

```bash
flora registrar --disciplina "Língua Portuguesa" --topico "Crase" --itens 10 --acertos 7
```

O Flora salva a sessão, marca o tópico como estudado, recalcula seu domínio da
disciplina e agenda a próxima revisão:

| Aproveitamento | Próxima revisão |
| --- | --- |
| abaixo de 60% | amanhã |
| de 60% a 79% | em 7 dias |
| 80% ou mais | em 21 dias |

Rode `flora plano` de vez em quando para redistribuir o tempo pelo seu
desempenho atual.

## Como o plano funciona

1. **Diagnóstico** (cerca de 10% do prazo): uma bateria de questões por
   disciplina, das que valem mais para as que valem menos, antes de qualquer
   teoria.
2. **Estudo e prática**: base curta seguida de prática, tópico por tópico. O
   tempo de cada disciplina segue o número de questões na prova e aumenta onde
   seu domínio é menor. As disciplinas se alternam no mesmo dia.
3. **Revisão e simulados** (os últimos 20%): prática mista, revisões vencidas e
   um simulado por semana no último dia de estudo.

O método e as pesquisas que o sustentam estão em [docs/metodo.md](docs/metodo.md).

## Automatizar

O Flora não depende de nenhum serviço. Escolha o que preferir:

- **Agendador do sistema:** gere o `Hoje.md` toda manhã com cron ou launchd.
- **Assistente de IA (Claude, ChatGPT, Codex…):** `flora hoje --json` entrega o dia
  em formato estruturado, e o assistente registra os resultados com
  `flora registrar --json`.
- **Obsidian:** abra a pasta como vault; as notas e links funcionam sem
  configuração.

Os exemplos prontos estão em [docs/automacao.md](docs/automacao.md).

## Comandos

```
flora concursos                 lista os concursos do catálogo
flora iniciar [pasta]           cria um vault (interativo ou com --concurso, --inicio, --horas, --dias)
flora hoje [--salvar] [--json]  revisões vencidas e aulas do dia
flora registrar ...             salva uma sessão e agenda a revisão
flora plano                     recalcula Plano.md
flora validar                   confere fontes e questões versionadas
flora ajuda                     todas as opções
```

Use `--vault <pasta>` para rodar de fora da pasta do vault e `--data AAAA-MM-DD`
para simular outro dia.

## Contribuir

O jeito mais útil de ajudar é **adicionar ou conferir um concurso** no
catálogo. Também há espaço para código, documentação e adaptadores. Comece pelo
[CONTRIBUTING.md](CONTRIBUTING.md) e pelo [roadmap](docs/roadmap.md).

> O Flora organiza dados públicos dos editais, mas não substitui o edital
> vigente. Sempre confira retificações no site oficial do concurso.

## Licença

[MIT](LICENSE).
