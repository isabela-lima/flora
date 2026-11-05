import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDailyContext,
  selectVerifiedQuestions,
  type FloraCatalog,
} from "../src/catalog.js";
import type { RecordEntry } from "../src/validate.js";

function record(file: string, data: Record<string, unknown>): RecordEntry {
  return { file, data };
}

function catalog(): FloraCatalog {
  return {
    modules: [
      record("ALEPA/ALEPA.md", {
        schema: "flora/modulo@1",
        id: "modulo-alepa",
        titulo: "ALEPA",
        status: "ativo",
      }),
    ],
    sources: [
      record("Fontes/prova.md", {
        schema: "flora/fonte@1",
        id: "prova-oficial",
        titulo: "Prova oficial",
        validacao: "conferida",
      }),
      record("Fontes/pendente.md", {
        schema: "flora/fonte@1",
        id: "fonte-pendente",
        titulo: "Fonte pendente",
        validacao: "pendente",
      }),
    ],
    questions: [
      record("Questoes/acid.md", {
        schema: "flora/questao@1",
        id: "questao-acid",
        assunto: "Banco de dados — propriedades ACID",
        validacao: "conferida",
        fontes: ["prova-oficial"],
        modulos: ["modulo-alepa"],
      }),
      record("Questoes/pendente.md", {
        schema: "flora/questao@1",
        id: "questao-pendente",
        assunto: "Banco de dados — SQL",
        validacao: "conferida",
        fontes: ["fonte-pendente"],
        modulos: ["modulo-alepa"],
      }),
      record("Questoes/lgpd.md", {
        schema: "flora/questao@1",
        id: "questao-lgpd",
        assunto: "LGPD",
        validacao: "conferida",
        fontes: ["prova-oficial"],
        modulos: ["modulo-alepa"],
      }),
    ],
  };
}

test("seleciona apenas questões conferidas com fontes conferidas", () => {
  const selected = selectVerifiedQuestions(catalog(), "Banco de dados");
  assert.deepEqual(selected.map((question) => question.data.id), ["questao-acid"]);
});

test("daily context contém somente dependências da questão selecionada", () => {
  const context = buildDailyContext(catalog(), "banco de dados");
  assert.deepEqual(context.questions.map((question) => question.id), ["questao-acid"]);
  assert.deepEqual(context.sources.map((source) => source.id), ["prova-oficial"]);
  assert.deepEqual(context.modules.map((module) => module.id), ["modulo-alepa"]);
});
