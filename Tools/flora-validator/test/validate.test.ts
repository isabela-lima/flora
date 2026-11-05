import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { validateVault } from "../src/validate.js";

async function createVault(): Promise<string> {
  const vault = await mkdtemp(path.join(os.tmpdir(), "flora-validator-"));
  await mkdir(path.join(vault, "Notas"));
  return vault;
}

async function note(vault: string, name: string, frontmatter: string): Promise<void> {
  await writeFile(path.join(vault, "Notas", name), `---\n${frontmatter}\n---\n`);
}

test("aceita fonte e questão oficial completas", async () => {
  const vault = await createVault();
  await note(vault, "fonte.md", `schema: flora/fonte@1
id: prova-2026
tipo: fonte
titulo: Prova oficial
categoria: prova
referencia: Caderno oficial
url: https://example.com/prova.pdf
validacao: conferida
verificado_em: 2026-10-31`);
  await note(vault, "questao.md", `schema: flora/questao@1
id: questao-1
tipo: questao
origem: oficial-banca
assunto: Banco de dados
oficial: true
banca: Banca Exemplo
concurso: Concurso Exemplo
numero: 1
pagina: 2
caderno_url: https://example.com/prova.pdf
gabarito_url: https://example.com/gabarito.pdf
gabarito: A
validacao: conferida
verificado_em: 2026-10-31
fontes:
  - prova-2026`);

  const report = await validateVault(vault);
  assert.deepEqual(report.issues, []);
  assert.equal(report.versionedRecords, 2);
});

test("rejeita questão oficial incompleta e fonte inexistente", async () => {
  const vault = await createVault();
  await note(vault, "questao.md", `schema: flora/questao@1
id: questao-1
tipo: questao
origem: oficial-banca
assunto: Banco de dados
oficial: false
validacao: conferida
fontes:
  - fonte-ausente`);

  const report = await validateVault(vault);
  const messages = report.issues.map((issue) => issue.message);
  assert(messages.includes("fonte inexistente: fonte-ausente"));
  assert(messages.includes("questão de origem oficial deve usar oficial: true"));
  assert(messages.includes("questão oficial sem caderno_url"));
  assert(messages.includes("questão conferida sem gabarito"));
});

test("rejeita ids duplicados", async () => {
  const vault = await createVault();
  const frontmatter = `schema: flora/modulo@1
id: mesmo-id
tipo: modulo
titulo: Estudo livre
natureza: livre
status: ativo`;
  await note(vault, "a.md", frontmatter);
  await note(vault, "b.md", frontmatter);

  const report = await validateVault(vault);
  assert(report.issues.some((issue) => issue.message.startsWith("id duplicado 'mesmo-id'")));
});

test("não confere questão autoral apoiada em fonte pendente", async () => {
  const vault = await createVault();
  await note(vault, "fonte.md", `schema: flora/fonte@1
id: artigo-pendente
tipo: fonte
titulo: Artigo ainda não verificado
categoria: artigo
referencia: Referência bibliográfica
validacao: pendente`);
  await note(vault, "questao.md", `schema: flora/questao@1
id: questao-autoral-1
tipo: questao
origem: autoral-fundamentada
assunto: Banco de dados
oficial: false
gabarito: A
validacao: conferida
fontes:
  - artigo-pendente`);

  const report = await validateVault(vault);
  assert(report.issues.some((issue) => issue.message === "questão validada referencia fonte não conferida: artigo-pendente"));
});
