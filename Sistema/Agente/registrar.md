# /registrar — registrar o resultado contado no chat

A pessoa conta como foi (“acertei 7 de 10, errei as de crase por distração”).
Você registra. Ela nunca precisa editar notas.

## Passos

1. **Onde registrar:** na `Private/Aula de hoje.md` se for a aula de hoje; na
   cópia em `Private/<SIGLA>/Sessões/` se a aula já tiver sido arquivada; ou numa
   nota nova em `Private/<SIGLA>/Sessões/AAAA-MM-DD — tema curto.md`, com o
   modelo `Templates/Sessão de estudo.md`, se foi um estudo avulso.
2. Preencha `itens`, `acertos` e `proxima_revisao`. Se faltar o número de
   questões, pergunte uma vez; não invente.
3. **Próxima revisão**, pela regra da aula ou do `Método de estudo.md`:
   abaixo de 60%, em 1 a 3 dias; de 60% a 79%, em cerca de 7 dias; 80% ou mais,
   em cerca de 21 dias; mesmo erro pela segunda vez, em até 7 dias.
4. **Erros:** para cada falha que possa se repetir, crie uma nota em
   `Private/<SIGLA>/Erros/` com o modelo `Templates/Erro.md` (`disciplina`,
   `assunto`, `causa`, `proxima_revisao`). Se o erro já existir, some 1 a
   `evidencias` quando a pessoa acertar e marque `status: resolvido` na segunda
   evidência em dias diferentes.
5. **Disciplina:** atualize `status` e `dominio` (0 a 5) da nota em
   `Private/<SIGLA>/Disciplinas/` só quando houver evidência nova de questões.
   Domínio vem de desempenho, não de sensação de familiaridade.
6. **Progresso:** atualize a linha do tópico em `Private/<SIGLA>/Progresso.md`
   com o novo status (`D`, `E`, `P`, `R`, `M`) e a evidência no formato
   `03/11 — 7/10 (70%)`.
7. Responda com um resumo curto: o que registrou, a próxima revisão e, se fizer
   sentido, a próxima ação.

Questões sem fonte suficiente não alteram domínio, status nem diagnóstico.
