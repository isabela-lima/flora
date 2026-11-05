# Roadmap

Ideias em ordem de prioridade. Cada item pode virar uma issue; comente antes de
começar para não duplicar trabalho.

## Agora

- [ ] **Mais concursos no catálogo**, com conferência por uma segunda pessoa.
- [ ] `flora erro`: registrar um erro em `Erros/` pela CLI, com causa e revisão.
- [ ] `flora simulado`: registrar acertos por disciplina de uma vez.
- [ ] Publicar no npm para instalar com `npx flora-estudos iniciar`.

## Depois

- [ ] **Ler o edital automaticamente:** a partir do PDF, um modelo de IA propõe o
      JSON do concurso, que entra como `pendente` até alguém conferir. O
      extrator fica num adaptador separado; o núcleo continua sem IA.
- [ ] Vários concursos no mesmo vault.
- [ ] Ajustar o plano por datas indisponíveis (viagens, plantões).
- [ ] Exportar os blocos de estudo para calendário (`.ics`).
- [ ] Adaptador do Obsidian com painéis (Bases) e tema opcional.

## Princípios

- Markdown é a fonte da verdade; a CLI só lê e escreve arquivos.
- Plano e rotina determinísticos e testados.
- Nenhum fornecedor obrigatório.
