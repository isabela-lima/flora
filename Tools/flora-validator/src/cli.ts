import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildDailyContext,
  loadCatalog,
  selectVerifiedQuestions,
} from "./catalog.js";
import { validateVault, type RecordEntry } from "./validate.js";

const ownDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultVault = path.resolve(ownDirectory, "../../..");
const args = process.argv.slice(2);
const command = args[0]?.startsWith("-") ? "validate" : (args[0] ?? "validate");
const json = args.includes("--json");
const vaultRoot = path.resolve(option("--vault") ?? defaultVault);

try {
  if (command === "validate") {
    await runValidate();
  } else if (command === "sources") {
    const catalog = await loadCatalog(vaultRoot);
    printRecords(catalog.sources);
  } else if (command === "questions") {
    const catalog = await loadCatalog(vaultRoot);
    printRecords(selectVerifiedQuestions(catalog, option("--topic")));
  } else if (command === "daily-context") {
    const topic = option("--topic");
    if (!topic) throw new Error("daily-context exige --topic");
    const catalog = await loadCatalog(vaultRoot);
    console.log(JSON.stringify(buildDailyContext(catalog, topic), null, 2));
  } else if (command === "help") {
    printHelp();
  } else {
    throw new Error(`comando desconhecido: ${command}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}

async function runValidate(): Promise<void> {
  const report = await validateVault(vaultRoot);
  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`Arquivos Markdown lidos: ${report.scannedFiles}`);
    console.log(`Registros Flora versionados: ${report.versionedRecords}`);
    if (report.issues.length === 0) {
      console.log("Validação concluída sem problemas.");
    } else {
      console.error(`Problemas encontrados: ${report.issues.length}`);
      for (const issue of report.issues) console.error(`- ${issue.file}: ${issue.message}`);
    }
  }
  process.exitCode = report.issues.length === 0 ? 0 : 1;
}

function printRecords(records: RecordEntry[]): void {
  if (json) {
    console.log(JSON.stringify(records.map((record) => ({ file: record.file, ...record.data })), null, 2));
    return;
  }
  if (records.length === 0) {
    console.log("Nenhum registro encontrado.");
    return;
  }
  for (const record of records) {
    console.log(`${String(record.data.id)}\t${String(record.data.titulo ?? record.data.assunto ?? "")}\t${record.file}`);
  }
}

function option(name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function printHelp(): void {
  console.log(`flora validate [--json] [--vault caminho]
flora sources [--json] [--vault caminho]
flora questions [--topic assunto] [--json] [--vault caminho]
flora daily-context --topic assunto [--vault caminho]`);
}
