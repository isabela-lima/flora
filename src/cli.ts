import { writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

import { buildDailyContext, loadCatalog, selectVerifiedQuestions } from "./catalog.js";
import { findConcurso, loadConcursos, totalQuestoes, type Concurso } from "./concurso.js";
import { formatBR, isDate, parseWeekdays, today } from "./dates.js";
import { renderPlano } from "./plan.js";
import { montarHoje, renderHoje, type Atividade } from "./routine.js";
import { validateVault, type RecordEntry } from "./validate.js";
import { carregarVault, iniciarVault, registrarSessao } from "./vault.js";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogoDir = path.join(packageRoot, "concursos");
const args = process.argv.slice(2);
const command = args[0] && !args[0].startsWith("-") ? args[0] : "ajuda";
const json = args.includes("--json");
const vaultRoot = path.resolve(option("--vault") ?? process.cwd());
const ATIVIDADES: Atividade[] = ["diagnostico", "estudo", "pratica", "simulado"];

try {
  switch (command) {
    case "concursos":
      await runConcursos();
      break;
    case "iniciar":
      await runIniciar();
      break;
    case "hoje":
      await runHoje();
      break;
    case "registrar":
      await runRegistrar();
      break;
    case "plano":
      await runPlano();
      break;
    case "validar":
    case "validate":
      await runValidate();
      break;
    case "fontes":
    case "sources":
      printRecords((await loadCatalog(vaultRoot)).sources);
      break;
    case "questoes":
    case "questions":
      printRecords(selectVerifiedQuestions(await loadCatalog(vaultRoot), option("--topic") ?? option("--assunto")));
      break;
    case "daily-context": {
      const topic = option("--topic") ?? option("--assunto");
      if (!topic) throw new Error("daily-context exige --assunto");
      console.log(JSON.stringify(buildDailyContext(await loadCatalog(vaultRoot), topic), null, 2));
      break;
    }
    case "ajuda":
    case "help":
      printHelp();
      break;
    default:
      throw new Error(`comando desconhecido: ${command}. Rode \`flora ajuda\`.`);
  }
} catch (error) {
  console.error(`flora: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 2;
}

async function runConcursos(): Promise<void> {
  const concursos = await loadConcursos(catalogoDir);
  if (json) {
    console.log(JSON.stringify(concursos.map(({ id, titulo, cargo, data_prova, validacao }) => ({ id, titulo, cargo, data_prova, validacao })), null, 2));
    return;
  }
  for (const c of concursos) {
    const aviso = c.validacao === "conferida" ? "" : " (ainda não conferido)";
    console.log(`${c.id}\n  ${c.titulo} — prova em ${formatBR(c.data_prova)}${aviso}`);
  }
}

async function runIniciar(): Promise<void> {
  const dir = path.resolve(args[1] && !args[1].startsWith("-") ? args[1] : (option("--vault") ?? process.cwd()));
  const interativo = process.stdin.isTTY && !args.includes("--sem-perguntas");
  const rl = interativo ? createInterface({ input: process.stdin, output: process.stdout }) : undefined;
  const ask = async (pergunta: string, padrao: string): Promise<string> => {
    if (!rl) return padrao;
    const resposta = (await rl.question(`${pergunta} [${padrao}]: `)).trim();
    return resposta === "" ? padrao : resposta;
  };

  try {
    let concurso: Concurso;
    const id = option("--concurso");
    if (id) {
      concurso = await findConcurso(catalogoDir, id);
    } else if (rl) {
      const concursos = await loadConcursos(catalogoDir);
      console.log("Concursos disponíveis no catálogo:");
      concursos.forEach((c, i) => console.log(`  ${i + 1}. ${c.titulo} — prova em ${formatBR(c.data_prova)}`));
      console.log("  (Seu concurso não está aqui? Veja CONTRIBUTING.md para adicioná-lo.)");
      const escolha = Number(await ask("Qual concurso? Digite o número", "1"));
      concurso = concursos[escolha - 1];
      if (!concurso) throw new Error(`opção inválida: ${escolha}`);
    } else {
      throw new Error("informe --concurso <id>. Veja os ids com `flora concursos`.");
    }

    const inicio = option("--inicio") ?? await ask("Começar em (AAAA-MM-DD)", today());
    if (!isDate(inicio)) throw new Error(`data inválida: ${inicio}`);
    const horas = Number(option("--horas") ?? await ask("Quantas horas por semana você pode estudar?", "10"));
    const dias = parseWeekdays(option("--dias") ?? await ask("Em quais dias? (dom,seg,ter,qua,qui,sex,sab)", "seg,ter,qua,qui,sex"));

    const criados = await iniciarVault(dir, concurso, { inicio, horas_semana: horas, dias });
    console.log(`\nVault criado em ${dir} para ${concurso.titulo} (${totalQuestoes(concurso)} questões, ${concurso.disciplinas.length} disciplinas).`);
    console.log(`Arquivos: ${criados.length}. Abra Concurso.md e Plano.md em qualquer editor de Markdown.`);
    console.log(`\nPróximo passo:\n  cd ${JSON.stringify(dir)}\n  flora hoje`);
  } finally {
    rl?.close();
  }
}

async function runHoje(): Promise<void> {
  const vault = await carregarVault(vaultRoot);
  const data = option("--data") ?? today();
  if (!isDate(data)) throw new Error(`data inválida: ${data}`);
  const hoje = montarHoje(data, vault.config, vault.disciplinas, vault.registros);
  if (json) {
    console.log(JSON.stringify(hoje, null, 2));
    return;
  }
  const markdown = renderHoje(hoje);
  if (args.includes("--salvar")) {
    await writeFile(path.join(vaultRoot, "Hoje.md"), markdown);
    console.log(`Hoje.md atualizado em ${vaultRoot}`);
  } else {
    console.log(markdown);
  }
}

async function runRegistrar(): Promise<void> {
  const vault = await carregarVault(vaultRoot);
  const disciplina = option("--disciplina");
  if (!disciplina) throw new Error("informe --disciplina");
  const atividade = (option("--atividade") ?? "estudo") as Atividade;
  if (!ATIVIDADES.includes(atividade)) throw new Error(`--atividade deve ser um de: ${ATIVIDADES.join(", ")}`);
  const data = option("--data") ?? today();
  if (!isDate(data)) throw new Error(`data inválida: ${data}`);

  const resultado = await registrarSessao(vault, {
    data,
    disciplina,
    topico: option("--topico"),
    atividade,
    itens: Number(option("--itens")),
    acertos: Number(option("--acertos")),
  });
  if (json) {
    console.log(JSON.stringify(resultado, null, 2));
    return;
  }
  console.log(`Sessão salva em ${resultado.arquivo}: ${resultado.aproveitamento}% de aproveitamento.`);
  console.log(`Próxima revisão em ${formatBR(resultado.proxima_revisao)}. Domínio da disciplina: ${resultado.dominio}/5.`);
  if (resultado.revisoesFechadas.length > 0) console.log(`Revisões concluídas: ${resultado.revisoesFechadas.join(", ")}`);
}

async function runPlano(): Promise<void> {
  const vault = await carregarVault(vaultRoot);
  const markdown = renderPlano(vault.config, vault.disciplinas, option("--data") ?? today());
  await writeFile(path.join(vaultRoot, "Plano.md"), markdown);
  console.log(markdown);
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
  console.log(`Flora — rotina de estudos para concursos em arquivos Markdown

Começar
  flora concursos                       lista os concursos do catálogo
  flora iniciar [pasta]                 cria seu vault (pergunta concurso, horas e dias)
        --concurso <id> --inicio AAAA-MM-DD --horas 10 --dias seg,qua,sex

Rotina
  flora hoje [--salvar] [--json]        revisões vencidas e aulas do dia
  flora registrar --disciplina "Nome" --itens 10 --acertos 7
        [--topico "..."] [--atividade diagnostico|estudo|pratica|simulado]
  flora plano                           recalcula Plano.md pelo seu desempenho

Conteúdo verificado
  flora validar | fontes | questoes [--assunto x] | daily-context --assunto x

Opções gerais: --vault <pasta> (padrão: pasta atual), --data AAAA-MM-DD, --json`);
}
