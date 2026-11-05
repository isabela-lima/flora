# /aula — preparar a aula do dia

Monte `Private/Aula de hoje.md` para a data local de hoje. A aula deve caber no
tempo disponível e ser feita só lendo: a pessoa responde de cabeça ou no papel
e conta o resultado no chat.

## 1. Verificar antes de mexer

- Confirme que `Private/` existe e pode ser lida. Se não existir, siga o
  “Primeiro uso” de `AGENTS.md`.
- Descubra o módulo ativo (veja `AGENTS.md`) e a sigla `<SIGLA>`.
- Só substitua a aula existente depois de reunir tudo e ter uma versão
  completa pronta.

## 2. Decidir tema e duração

Use a primeira fonte disponível:

1. **Calendário**, se houver integração (Google Agenda ou outro): eventos de
   estudo de hoje, com títulos como Estudo, Revisão, Questões, Diagnóstico,
   Simulado ou a sigla do módulo. Ignore compromissos pessoais e não os mencione.
   Se houver mais de um bloco, faça uma seção por bloco, na ordem dos horários.
2. **O que a pessoa disse no chat** (“tenho 1 hora, quero ver crase”).
3. **O próprio vault:** revisões vencidas (`proxima_revisao` até hoje e
   `status` diferente de `resolvido`) primeiro; depois o
   `Private/<SIGLA>/Plano até a prova.md`; depois o tópico de maior peso ainda
   em `D` ou `E` no `Private/<SIGLA>/Progresso.md`. Duração padrão: 45 minutos.

Quando o tema for amplo, escolha **um único recorte** de alto rendimento,
orientado pelo conteúdo programático, pelos erros e pelo progresso, e explique
em uma linha por que ele foi escolhido.

## 3. Ler o contexto

`Private/<SIGLA>/Progresso.md`, `Private/<SIGLA>/Plano até a prova.md`,
`<SIGLA>/Conteúdo programático.md`, a página da banca em `<SIGLA>/`, as notas de
`Private/<SIGLA>/Erros/` com `status: ativo`, os simulados e as sessões mais
recentes. Use erros e revisões pendentes quando forem relevantes ao tema.

## 4. Arquivar a aula anterior

Se a aula atual tiver `data` anterior a hoje e `status: pronto`, copie o arquivo
inteiro para `Private/<SIGLA>/Sessões/AAAA-MM-DD — tema curto.md`, trocando
`tipo` para `sessao` e mantendo os demais campos (inclusive `itens`, `acertos`
e `proxima_revisao`). Se já existir um arquivo com esse nome, não sobrescreva.
Nunca apague a cópia arquivada.

## 5. Escrever a aula

Frontmatter: `tipo: aula-do-dia`, `modulo: <SIGLA>`, `modulo_id`, `data`,
`tema`, `disciplina`, `assunto`, `horario` e `duracao` (se houver),
`status: pronto`, `gerado_em` (data e hora local), `fonte_evento` (se veio do
calendário), `fontes` e `questoes` só com os IDs Flora efetivamente usados,
`cssclasses: [flora-module]`, e `itens`, `acertos` e `proxima_revisao` vazios.
Para `data` e `gerado_em`, use o relógio do sistema; se não tiver acesso a ele,
use a data que a pessoa ou a automação informar e não invente o horário.

Corpo, nesta ordem:

1. **Objetivo** mensurável.
2. **Recuperação ativa — 5 min:** perguntas para responder sem consulta.
3. **Explicação essencial:** curta, apoiada em um caso, comparação ou exemplo.
4. **Questões autorais fundamentadas**, no formato da banca (veja a página da
   banca no módulo), com fontes confiáveis citadas e o tempo indicado. Nunca as
   apresente como oficiais.
5. **Questões reais da banca:** de 2 a 5 questões oficiais sobre o recorte.
   Prefira notas em `<SIGLA>/Questões/` com `validacao: conferida` e fontes
   conferidas. Não transcreva enunciados nem alternativas: indique concurso,
   cargo, número, página e o link do caderno oficial. Se não houver questão
   verificada, diga isso em uma linha e não invente.
6. **Gabaritos** sempre em callout recolhido (`> [!success]- Gabarito`), com a
   letra e uma justificativa curta em palavras próprias.
7. **Correção por causa:** conteúdo, interpretação, procedimento, atenção ou
   tempo.
8. **Mídia complementar:** no máximo 4 recursos oficiais, gratuitos e atuais,
   com tipo, finalidade, esforço e se é “essencial hoje”, “aquecimento” ou
   “aprofundamento opcional”. Em blocos curtos, a mídia obrigatória não passa de
   20% do tempo.
9. **Contar no chat:** um exemplo curto de mensagem de resultado e a regra de
   próxima revisão que você aplicará.

Regras de escrita: nada de checkboxes, lacunas (`___`) ou pedidos para a pessoa
escrever na nota; priorize recuperação e questões a texto longo; use fontes
oficiais para legislação (texto compilado, atento a alterações) e documentação
oficial para conteúdo técnico; livro pago só como opcional, com o capítulo que
justifica a indicação. Verifique ao vivo todos os links usados.

## 6. Validar

Releia o arquivo gravado e confira: a data é hoje; `status` é `pronto`; os
tempos somam a duração; há objetivo, prática, gabarito, fechamento e mídia; os
links estão bem formados. Se algo falhar, corrija uma vez e valide de novo.

## Sem aula hoje ou com falha

- Sem bloco de estudo: atualize a página com a data, `gerado_em`,
  `status: sem-aula` e uma mensagem curta, e informe o próximo bloco se for
  fácil de obter.
- Se calendário, internet ou vault estiverem indisponíveis, **não apague nem
  substitua** a última aula válida. Explique a falha e aponte
  `Private/Plano B da aula.md`. Nunca apresente conteúdo inventado.
- Quando rodar sozinho (automação), não envie mensagem se tudo deu certo; avise
  só quando uma falha impedir preparar, gravar ou validar a aula.
