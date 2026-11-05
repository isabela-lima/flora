import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const SCHEMAS = new Set(["flora/modulo@1", "flora/fonte@1", "flora/questao@1"]);
const IGNORED_DIRECTORIES = new Set([".git", ".obsidian", "Templates", "node_modules"]);
export type Frontmatter = Record<string, unknown>;

export interface ValidationIssue {
  file: string;
  message: string;
}

export interface ValidationReport {
  scannedFiles: number;
  versionedRecords: number;
  issues: ValidationIssue[];
}

export interface RecordEntry {
  file: string;
  data: Frontmatter;
}

export interface VaultRecords {
  scannedFiles: number;
  records: RecordEntry[];
}

export async function validateVault(vaultRoot: string): Promise<ValidationReport> {
  const catalog = await readVersionedRecords(vaultRoot);
  const records: RecordEntry[] = [];
  const issues: ValidationIssue[] = [];

  for (const record of catalog.records) {
    const { file, data } = record;
    const schema = data.schema;
    if (typeof schema !== "string" || !SCHEMAS.has(schema)) {
      issues.push({ file, message: `schema desconhecido: ${schema}` });
      continue;
    }

    records.push(record);
    validateFrontmatter(file, data, issues);
  }

  validateIds(records, issues);
  validateQuestions(records, issues);

  return { scannedFiles: catalog.scannedFiles, versionedRecords: records.length, issues };
}

export async function readVersionedRecords(vaultRoot: string): Promise<VaultRecords> {
  const files = await findMarkdownFiles(vaultRoot);
  const records: RecordEntry[] = [];
  for (const file of files.sort()) {
    const content = await readFile(path.join(vaultRoot, file), "utf8");
    const data = parseFrontmatter(content);
    if (typeof data.schema === "string" && data.schema.startsWith("flora/")) {
      records.push({ file, data });
    }
  }
  return { scannedFiles: files.length, records };
}

async function findMarkdownFiles(root: string, relative = ""): Promise<string[]> {
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory() && !IGNORED_DIRECTORIES.has(entry.name)) {
      files.push(...await findMarkdownFiles(root, child));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(child);
    }
  }
  return files;
}

function parseFrontmatter(content: string): Frontmatter {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== "---") return {};
  const end = lines.indexOf("---", 1);
  if (end === -1) return {};

  const data: Frontmatter = {};
  let listKey: string | undefined;
  for (const line of lines.slice(1, end)) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && listKey) {
      (data[listKey] as unknown[]).push(parseScalar(listItem[1]));
      continue;
    }

    const field = line.match(/^([A-Za-z_][\w-]*):(?:\s*(.*))?$/);
    if (!field) continue;
    const [, key, raw = ""] = field;
    if (raw === "") {
      data[key] = [];
      listKey = key;
    } else {
      data[key] = parseScalar(raw);
      listKey = undefined;
    }
  }
  return data;
}

function parseScalar(raw: string): unknown {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+$/.test(value)) return Number(value);
  if (value === "[]") return [];
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function validateFrontmatter(
  file: string,
  data: Frontmatter,
  issues: ValidationIssue[],
): void {
  const report = (message: string): void => {
    issues.push({ file, message });
  };
  const requiredString = (field: string): void => {
    if (typeof data[field] !== "string" || data[field].length === 0) {
      report(`${field} deve ser texto não vazio`);
    }
  };
  const exact = (field: string, expected: unknown): void => {
    if (data[field] !== expected) report(`${field} deve ser ${String(expected)}`);
  };
  const oneOf = (field: string, values: readonly string[]): void => {
    if (typeof data[field] !== "string" || !values.includes(data[field])) {
      report(`${field} deve ser um de: ${values.join(", ")}`);
    }
  };
  const optionalDate = (field: string): void => {
    if (data[field] !== undefined && !isDate(data[field])) report(`${field} deve ser uma data YYYY-MM-DD`);
  };
  const optionalUrl = (field: string): void => {
    if (data[field] !== undefined && !isUrl(data[field])) report(`${field} deve ser uma URL válida`);
  };
  const stringList = (field: string, required = false): void => {
    const value = data[field];
    if (!Array.isArray(value) || (required && value.length === 0) || value.some((item) => typeof item !== "string" || item.length === 0)) {
      report(`${field} deve ser uma lista${required ? " não vazia" : ""} de textos não vazios`);
    } else if (new Set(value).size !== value.length) {
      report(`${field} não deve conter itens duplicados`);
    }
  };

  requiredString("id");

  if (data.schema === "flora/modulo@1") {
    exact("tipo", "modulo");
    requiredString("titulo");
    oneOf("natureza", ["concurso", "curso", "certificacao", "habilidade", "assunto", "projeto", "livre"]);
    oneOf("status", ["planejamento", "ativo", "pausado", "concluido", "arquivado"]);
    optionalDate("data_inicio");
    optionalDate("data_alvo");
    if (data.assuntos !== undefined) stringList("assuntos");
  } else if (data.schema === "flora/fonte@1") {
    exact("tipo", "fonte");
    requiredString("titulo");
    oneOf("categoria", ["edital", "lei", "norma", "documentacao", "artigo", "livro", "curso", "video", "prova", "gabarito", "outro"]);
    requiredString("referencia");
    oneOf("validacao", ["pendente", "conferida", "desatualizada"]);
    optionalUrl("url");
    optionalDate("verificado_em");
  } else {
    exact("tipo", "questao");
    oneOf("origem", ["oficial-banca", "oficial-outra-banca", "adaptada", "autoral-fundamentada"]);
    requiredString("assunto");
    if (typeof data.oficial !== "boolean") report("oficial deve ser booleano");
    oneOf("validacao", ["pendente", "fonte-conferida", "conferida", "anulada"]);
    stringList("fontes", true);
    if (data.modulos !== undefined) stringList("modulos");
    if (data.ano !== undefined && (!Number.isInteger(data.ano) || (data.ano as number) < 1900)) report("ano deve ser inteiro a partir de 1900");
    if (data.pagina !== undefined && (!Number.isInteger(data.pagina) || (data.pagina as number) < 1)) report("pagina deve ser inteiro positivo");
    if (data.numero !== undefined && !(Number.isInteger(data.numero) || (typeof data.numero === "string" && data.numero.length > 0))) report("numero deve ser inteiro ou texto não vazio");
    optionalUrl("caderno_url");
    optionalUrl("gabarito_url");
    optionalDate("verificado_em");
  }
}

function isDate(value: unknown): boolean {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value);
}

function isUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validateIds(records: RecordEntry[], issues: ValidationIssue[]): void {
  const seen = new Map<string, string>();
  for (const record of records) {
    if (typeof record.data.id !== "string" || record.data.id.length === 0) continue;
    const previous = seen.get(record.data.id);
    if (previous) {
      issues.push({
        file: record.file,
        message: `id duplicado '${record.data.id}', já usado em ${previous}`,
      });
    } else {
      seen.set(record.data.id, record.file);
    }
  }
}

function validateQuestions(records: RecordEntry[], issues: ValidationIssue[]): void {
  const sourcesById = new Map<string, Frontmatter>();
  for (const record of records) {
    if (record.data.schema === "flora/fonte@1" && typeof record.data.id === "string") {
      sourcesById.set(record.data.id, record.data);
    }
  }

  for (const record of records) {
    if (record.data.schema !== "flora/questao@1") continue;
    const data = record.data;
    const sources = Array.isArray(data.fontes) ? data.fontes : [];
    for (const source of sources) {
      if (typeof source !== "string") continue;
      const sourceRecord = sourcesById.get(source);
      if (!sourceRecord) {
        issues.push({ file: record.file, message: `fonte inexistente: ${source}` });
      } else if (
        (data.validacao === "fonte-conferida" || data.validacao === "conferida") &&
        sourceRecord.validacao !== "conferida"
      ) {
        issues.push({ file: record.file, message: `questão validada referencia fonte não conferida: ${source}` });
      }
    }

    const officialOrigin =
      data.origem === "oficial-banca" || data.origem === "oficial-outra-banca";
    if (!officialOrigin) {
      if (data.oficial !== false) {
        issues.push({ file: record.file, message: "questão adaptada ou autoral deve usar oficial: false" });
      }
      continue;
    }

    if (data.oficial !== true) {
      issues.push({ file: record.file, message: "questão de origem oficial deve usar oficial: true" });
    }
    for (const field of [
      "banca",
      "concurso",
      "numero",
      "caderno_url",
      "gabarito_url",
      "verificado_em",
    ]) {
      if (data[field] === undefined || data[field] === "") {
        issues.push({ file: record.file, message: `questão oficial sem ${field}` });
      }
    }
    if (data.validacao === "conferida" && !data.gabarito) {
      issues.push({ file: record.file, message: "questão conferida sem gabarito" });
    }
  }
}
