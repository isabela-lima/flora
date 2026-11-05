import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { checkConcurso, loadConcursos, type Concurso } from "../src/concurso.js";
import { cargas, etapas, type FloraConfig } from "../src/plan.js";
import { dominio, montarHoje, proximaRevisao, renderHoje } from "../src/routine.js";
import { carregarVault, iniciarVault, registrarSessao } from "../src/vault.js";

const catalogo = path.join(import.meta.dirname, "..", "concursos");

const concurso: Concurso = {
  id: "teste-2027-analista",
  titulo: "Teste 2027",
  orgao: "Órgão de Teste",
  cargo: "Analista",
  data_prova: "2027-03-01",
  validacao: "pendente",
  fontes: [{ titulo: "Edital", categoria: "edital", url: "https://example.org/edital.pdf" }],
  disciplinas: [
    { nome: "Português", questoes: 10, topicos: ["Crase", "Concordância"] },
    { nome: "Específicos", questoes: 30, topicos: ["SQL", "Redes", "Java"] },
  ],
};

test("todos os concursos do catálogo são válidos", async () => {
  const concursos = await loadConcursos(catalogo);
  assert.ok(concursos.length > 0);
});

test("checkConcurso aponta campos inválidos", () => {
  assert.deepEqual(checkConcurso(concurso), []);
  const problems = checkConcurso({ ...concurso, id: "Com Espaço", data_prova: "31/12/2027", disciplinas: [] });
  assert.equal(problems.length, 3);
});

test("etapas cobrem do início à véspera da prova, sem buracos", () => {
  const lista = etapas("2027-01-01", "2027-03-01");
  assert.deepEqual(lista.map((e) => e.fase), ["diagnostico", "estudo", "revisao"]);
  assert.equal(lista[0].inicio, "2027-01-01");
  assert.equal(lista.at(-1)!.fim, "2027-02-28");
  assert.throws(() => etapas("2027-03-01", "2027-03-01"));
});

test("cargas priorizam peso na prova e domínio baixo", () => {
  const config = { horas_semana: 10 } as FloraConfig;
  const [pt, esp] = cargas(config, [
    { nome: "Português", questoes: 10, dominio: 0 },
    { nome: "Específicos", questoes: 10, dominio: 5 },
  ]);
  assert.ok(pt.parcela > esp.parcela);
  assert.equal(Math.round((pt.parcela + esp.parcela) * 1000), 1000);
});

test("revisão segue o desempenho: 1, 7 ou 21 dias", () => {
  assert.equal(proximaRevisao("2027-01-10", 50), "2027-01-11");
  assert.equal(proximaRevisao("2027-01-10", 70), "2027-01-17");
  assert.equal(proximaRevisao("2027-01-10", 90), "2027-01-31");
  assert.equal(dominio([]), 0);
  assert.equal(dominio([100, 80]), 5);
});

test("fluxo completo: iniciar, hoje, registrar e revisar", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "flora-"));
  try {
    await iniciarVault(dir, concurso, { inicio: "2027-01-04", horas_semana: 7.5, dias: ["seg", "ter", "qua", "qui", "sex"] });
    await assert.rejects(() => iniciarVault(dir, concurso, { inicio: "2027-01-04", horas_semana: 5, dias: ["seg"] }));

    let vault = await carregarVault(dir);
    const primeiroDia = montarHoje("2027-01-04", vault.config, vault.disciplinas, vault.registros);
    assert.equal(primeiroDia.fase, "diagnostico");
    assert.deepEqual(primeiroDia.aulas.map((a) => [a.disciplina, a.atividade]), [
      ["Específicos", "diagnostico"],
      ["Português", "diagnostico"],
    ]);

    await registrarSessao(vault, { data: "2027-01-04", disciplina: "especificos", atividade: "diagnostico", itens: 10, acertos: 4 });
    vault = await carregarVault(dir);
    assert.equal(vault.disciplinas.find((d) => d.nome === "Específicos")!.status, "estudar");

    const diaSeguinte = montarHoje("2027-01-05", vault.config, vault.disciplinas, vault.registros);
    assert.equal(diaSeguinte.revisoes.length, 1);

    // Na etapa de estudo o dia intercala disciplinas e sugere o próximo tópico.
    const estudo = montarHoje("2027-01-20", vault.config, vault.disciplinas, vault.registros);
    assert.equal(estudo.fase, "estudo");
    assert.equal(new Set(estudo.aulas.map((a) => a.disciplina)).size, estudo.aulas.length);
    assert.equal(estudo.aulas.find((a) => a.disciplina === "Específicos")?.topico, "SQL");

    const resultado = await registrarSessao(vault, { data: "2027-01-20", disciplina: "Específicos", topico: "sql", atividade: "estudo", itens: 10, acertos: 9 });
    assert.equal(resultado.proxima_revisao, "2027-02-10");
    assert.equal(resultado.revisoesFechadas.length, 1);
    const nota = await readFile(path.join(dir, "Disciplinas", "Específicos.md"), "utf8");
    assert.match(nota, /^- \[x\] SQL$/m);

    vault = await carregarVault(dir);
    const depois = montarHoje("2027-01-21", vault.config, vault.disciplinas, vault.registros);
    assert.equal(depois.revisoes.length, 0);
    assert.notEqual(depois.aulas.find((a) => a.disciplina === "Específicos")?.topico, "SQL");

    assert.match(renderHoje(montarHoje("2027-03-01", vault.config, vault.disciplinas, vault.registros)), /boa prova/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
