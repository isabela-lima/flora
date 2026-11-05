---
tipo: erro
modulo: ALEPA
disciplina:
assunto:
causa: conteúdo
status: ativo
data: <% tp.date.now("YYYY-MM-DD") %>
proxima_revisao: <% tp.date.now("YYYY-MM-DD", 1) %>
evidencias: 0
---

# <% tp.file.title %>

## O que aconteceu


## Por que errei

Preencher `causa` com `conteúdo`, `interpretação`, `procedimento`, `atenção`,
`tempo` ou `cobertura`.

## Regra ou procedimento correto


## Exemplo próprio


## Plano de revisões

- <% tp.date.now("DD/MM", 1) %> — 

## Evidências para encerrar

Encerra com duas evidências corretas em dias diferentes; o agente soma
`evidencias` e muda `status` para `resolvido` quando você contar no chat.
