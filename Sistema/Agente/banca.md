# /banca — mapear o estilo e as questões reais da banca

Cria ou atualiza a página da banca no módulo (veja `ALEPA/Banca CETAP.md` como
referência completa) e registra questões oficiais reutilizáveis nas aulas.

## Passos

1. Identifique a banca no edital. Procure ao vivo, em sites oficiais da banca,
   provas e gabaritos definitivos de concursos anteriores com cargos ou
   conteúdos parecidos.
2. **Estilo:** número de alternativas, tipo de enunciado, extensão, pegadinhas
   recorrentes, distribuição por assunto. Escreva em palavras próprias.
3. **Índice:** para cada prova útil, liste concurso, cargo, caderno, número da
   questão, página e assunto, ligando cada uma a um tópico do conteúdo
   programático. Não transcreva enunciados nem alternativas.
4. **Questões versionadas:** para as mais úteis, crie notas em
   `<SIGLA>/Questões/` no formato de `ALEPA/Questões/` (`schema:
   flora/questao@1`), com links para caderno e gabarito definitivo. Marque
   `validacao: conferida` só depois de abrir o gabarito definitivo e conferir a
   letra.
5. Crie as notas de fonte em `<SIGLA>/Fontes/` para cada caderno e gabarito.
6. Rode o validador se possível e resuma: quantas provas, quantas questões
   indexadas, quantas conferidas e os tópicos sem nenhuma questão real.
