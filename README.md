# Flora 🌸

**Um caderno de estudos para concursos, pronto para usar no Obsidian.** Ele
organiza o que estudar, quando revisar e onde você erra, com um método baseado
em pesquisa: recuperação ativa, questões, correção por causa do erro e revisão
espaçada.

Se quiser, um assistente de IA (Claude ou Codex) faz o trabalho chato por você:
lê o edital do seu concurso, monta o plano, prepara a aula do dia e registra
seus resultados.

> [!NOTE]
> O Flora vem com um módulo de exemplo completo, o concurso da **ALEPA 2026
> (Analista Legislativo — Programação)**, montado e usado de verdade na
> preparação da autora. Explore para ver como fica o seu.
>
> **Versão inicial (v0.1).** A estrutura e a rotina funcionam; estudar antes do
> edital, vários concursos ao mesmo tempo e guias com capturas de tela estão no
> [roadmap](ROADMAP.md).

## Comece em 5 minutos

**1. Instale o [Obsidian](https://obsidian.md/)** (grátis, para computador e
celular).

**2. Baixe o Flora:** na página de
[**Releases**](https://github.com/isabela-lima/flora/releases/latest), baixe o
arquivo `flora.zip` e descompacte onde quiser, por exemplo em Documentos.

**3. Abra no Obsidian:** escolha **Abrir pasta como cofre** (*Open folder as
vault*), selecione a pasta do Flora e confie nos plugins quando o Obsidian
perguntar. Os plugins e o tema já vêm configurados.

O Flora abre na página inicial. Clique em **Comece aqui** e escolha como usar.

## Três jeitos de usar

| | Como funciona | Precisa de |
| --- | --- | --- |
| **1. Só Obsidian** | Você segue o roteiro de aula, registra cada sessão numa nota e o painel mostra as revisões vencidas, o caderno de erros e a contagem até a prova. | nada além do Obsidian |
| **2. Com assistente de IA** | Você abre a pasta no app do Claude ou do Codex e conversa: `/configurar` monta seu concurso, `/aula` prepara a aula, e o resultado contado no chat é registrado sozinho. | assinatura do Claude ou do ChatGPT |
| **3. Automático** | A aula fica pronta toda manhã, seguindo os blocos de estudo do seu calendário. | nível 2 e uma automação agendada |

Passo a passo dentro do vault: `Comece aqui.md`,
[`Sistema/Usar com um assistente de IA.md`](Sistema/Usar%20com%20um%20assistente%20de%20IA.md) e
[`Sistema/Automatizar a rotina.md`](Sistema/Automatizar%20a%20rotina.md).

## Comandos do assistente

| Comando | O que faz |
| --- | --- |
| `/configurar` | pergunta seu concurso, encontra o edital e monta o módulo, os painéis e o progresso |
| `/aula` | prepara a aula do dia, com questões no formato da banca e questões reais |
| `/registrar` | registra o resultado contado no chat: sessão, erros e próxima revisão |
| `/plano` | monta o plano até a prova pelas suas horas e pelo seu desempenho |
| `/banca` | mapeia o estilo e as provas anteriores da banca |
| `/edital` | confere retificações e o que mudou |
| `/simulado` | planeja ou corrige um simulado |
| `/revisao-semanal` | fecha a semana e ajusta o foco |

As instruções ficam em [`AGENTS.md`](AGENTS.md) e
[`Sistema/Agente/`](Sistema/Agente/), em texto aberto: dá para ler, ajustar e usar
com qualquer assistente.

## O que vem no vault

```
Comece aqui.md        primeiros passos
Home.md               página inicial
Método de estudo.md   o ciclo de estudo e as pesquisas que o sustentam
Conventions.md        regras do vault (propriedades, pastas, fontes)
ALEPA/                módulo de exemplo: edital, banca, fontes e questões
Templates/            modelos de sessão, erro, simulado e revisão semanal
Sistema/              guias e instruções do assistente
Schemas/, Tools/      contratos e validador de fontes e questões
Private/              seus resultados, erros e planos (criado no primeiro uso)
```

## Privacidade

Tudo o que é seu fica em `Private/`, que nunca vai para o GitHub (está no
`.gitignore`). Se for guardar o seu vault no GitHub, use um **repositório
privado**: forks de repositórios públicos são sempre públicos.

## Cuidados

- O Flora organiza dados públicos dos editais, mas **não substitui o edital
  vigente**. Sempre confira datas, conteúdo e retificações no site oficial.
- Questões **autorais** são criadas pelo assistente com fontes citadas; as
  **reais da banca** apontam para o PDF oficial, sem transcrição.
- Projeto independente, sem relação com bancas, órgãos ou com as empresas dos
  assistentes de IA citados.

## Contribuir

Toda ajuda é bem-vinda, principalmente de quem estuda para concurso: relatar
onde travou, sugerir melhorias no método, adicionar módulos de outros concursos
ou melhorar as instruções do assistente. Veja o [CONTRIBUTING.md](CONTRIBUTING.md)
e as issues marcadas com
[`good first issue`](https://github.com/isabela-lima/flora/labels/good%20first%20issue).

## Licença

[MIT](LICENSE). As fontes do tema têm licença própria (SIL OFL), em
`.obsidian/themes/Flora/licenses/`.
