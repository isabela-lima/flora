---
cssclasses:
  - flora-module
---

# Caderno de erros

Registrar apenas erros com chance de se repetir. Cada erro é uma nota em
`Erros/`, criada com o [[Templates/Erro|modelo de erro]]; a data de revisão fica
só na propriedade `proxima_revisao` da nota e alimenta a [[Private/ALEPA/Revisões|fila de revisões]].

## Ativos

![[Private/ALEPA/Erros.base#Ativos]]

## Padrões por causa

![[Private/ALEPA/Erros.base#Por causa]]

## Causas permitidas

- `conteúdo` — não sabia ou confundiu a regra;
- `interpretação` — leu o enunciado de forma incorreta;
- `procedimento` — sabia o conteúdo, mas aplicou um processo ruim;
- `atenção` — marcou, calculou ou transcreveu errado;
- `tempo` — não conseguiu concluir com segurança;
- `cobertura` — tópico ainda não medido.

## Quando encerrar um erro

Depois de duas evidências corretas em dias diferentes (`evidencias: 2`), mudar
`status` para `resolvido`. A nota sai da fila e aparece abaixo.

## Resolvidos

![[Private/ALEPA/Erros.base#Resolvidos]]
