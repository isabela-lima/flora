import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { totalQuestoes, type Concurso } from "./concurso.js";
import { formatBR, type Weekday } from "./dates.js";
import { renderPlano, type FloraConfig, type Pastas } from "./plan.js";
import { dominio, proximaRevisao, type Atividade, type DisciplinaEstado, type Registro } from "./routine.js";
import { parseFrontmatter } from "./validate.js";

export const CONFIG_FILE = "flora.json";
export const PASTAS: Pastas = { disciplinas: "Disciplinas", sessoes: "Sessões", erros: "Erros" };

export interface OpcoesInicio {
  inicio: string;
  horas_semana: number;
  dias: Weekday[];
  minutos_sessao?: number;
}

export async function iniciarVault(dir: string, concurso: Concurso, opcoes: OpcoesInicio): Promise<string[]> {
  if (await exists(path.join(dir, CONFIG_FILE))) {
    throw new Error(`${dir} já tem um ${CONFIG_FILE}. Use outra pasta ou apague o arquivo para recomeçar.`);
  }
  const config: FloraConfig = {
    versao: 1,
    inicio: opcoes.inicio,
    horas_semana: opcoes.horas_semana,
    dias: opcoes.dias,
    minutos_sessao: opcoes.minutos_sessao ?? 45,
    concurso,
  };
  if (!(config.horas_semana > 0)) throw new Error("horas por semana deve ser maior que zero");
  if (config.dias.length === 0) throw new Error("escolha ao menos um dia de estudo");

  const criados: string[] = [];
  const write = async (file: string, content: string): Promise<void> => {
    await mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await writeFile(path.join(dir, file), content, { flag: "wx" });
    criados.push(file);
  };

  await write(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
  await write("Concurso.md", renderConcurso(config));
  const total = totalQuestoes(concurso);
  for (const d of concurso.disciplinas) {
    await write(path.join(PASTAS.disciplinas, `${d.nome}.md`), renderDisciplina(d.nome, d.questoes, total, d.topicos));
  }
  for (const pasta of [PASTAS.sessoes, PASTAS.erros]) {
    await write(path.join(pasta, "LEIA-ME.md"), LEIA_ME[pasta]);
  }
  await write("Plano.md", renderPlano(config, concurso.disciplinas.map((d) => ({ ...d, dominio: 0 })), opcoes.inicio));
  return criados;
}

export interface Vault {
  dir: string;
  config: FloraConfig;
  pastas: Pastas;
  disciplinas: DisciplinaEstado[];
  registros: Registro[];
}

export async function carregarVault(dir: string): Promise<Vault> {
  let config: FloraConfig;
  try {
    config = JSON.parse(await readFile(path.join(dir, CONFIG_FILE), "utf8")) as FloraConfig;
  } catch {
    throw new Error(`não encontrei ${CONFIG_FILE} em ${dir}. Rode \`flora iniciar\` primeiro ou use --vault.`);
  }

  const pastas: Pastas = { ...PASTAS, ...config.pastas };

  // Cada disciplina do concurso é casada com uma nota da pasta pelo campo
  // `disciplina` do frontmatter ou, na falta dele, pelo nome do arquivo.
  const notas = new Map<string, { arquivo: string; content: string }>();
  const arquivosDisciplinas = await readdir(path.join(dir, pastas.disciplinas)).catch(() => [] as string[]);
  for (const file of arquivosDisciplinas.filter((f) => f.endsWith(".md")).sort()) {
    const arquivo = path.join(pastas.disciplinas, file);
    const content = await readFile(path.join(dir, arquivo), "utf8");
    const nome = str(parseFrontmatter(content).disciplina) ?? file.slice(0, -3);
    if (!notas.has(normalize(nome))) notas.set(normalize(nome), { arquivo, content });
  }

  const disciplinas: DisciplinaEstado[] = [];
  for (const d of config.concurso.disciplinas) {
    const nota = notas.get(normalize(d.nome));
    if (!nota) throw new Error(`não encontrei a nota da disciplina "${d.nome}" em ${pastas.disciplinas}/`);
    const data = parseFrontmatter(nota.content);
    disciplinas.push({
      nome: d.nome,
      questoes: d.questoes,
      status: String(data.status ?? "diagnosticar"),
      dominio: Number(data.dominio ?? 0),
      topicos: lerTopicos(nota.content),
      arquivo: nota.arquivo,
    });
  }

  const registros: Registro[] = [];
  for (const pasta of [pastas.sessoes, pastas.erros]) {
    const files = await readdir(path.join(dir, pasta)).catch(() => [] as string[]);
    for (const file of files.filter((f) => f.endsWith(".md")).sort()) {
      const arquivo = path.join(pasta, file);
      const data = parseFrontmatter(await readFile(path.join(dir, arquivo), "utf8"));
      if (typeof data.tipo !== "string") continue;
      registros.push({
        arquivo,
        tipo: data.tipo,
        data: str(data.data),
        disciplina: str(data.disciplina),
        topico: str(data.topico) ?? str(data.assunto),
        aproveitamento: typeof data.aproveitamento === "number" ? data.aproveitamento : undefined,
        proxima_revisao: str(data.proxima_revisao),
        status: str(data.status),
      });
    }
  }
  return { dir, config, pastas, disciplinas, registros };
}

export interface NovaSessao {
  data: string;
  disciplina: string;
  topico?: string;
  atividade: Atividade;
  itens: number;
  acertos: number;
}

export interface ResultadoRegistro {
  arquivo: string;
  aproveitamento: number;
  proxima_revisao: string;
  dominio: number;
  revisoesFechadas: string[];
}

export async function registrarSessao(vault: Vault, sessao: NovaSessao): Promise<ResultadoRegistro> {
  const disciplina = vault.disciplinas.find((d) => normalize(d.nome) === normalize(sessao.disciplina));
  if (!disciplina) {
    throw new Error(`disciplina "${sessao.disciplina}" não existe. Use uma de: ${vault.disciplinas.map((d) => d.nome).join(", ")}`);
  }
  if (!Number.isInteger(sessao.itens) || sessao.itens < 1) throw new Error("--itens deve ser inteiro positivo");
  if (!Number.isInteger(sessao.acertos) || sessao.acertos < 0 || sessao.acertos > sessao.itens) {
    throw new Error("--acertos deve ser inteiro entre 0 e --itens");
  }
  const topico = sessao.topico
    ? disciplina.topicos.find((t) => normalize(t.texto) === normalize(sessao.topico!))?.texto ?? sessao.topico
    : undefined;

  const aproveitamento = Math.round((sessao.acertos / sessao.itens) * 100);
  const revisao = proximaRevisao(sessao.data, aproveitamento);
  const base = `${sessao.data} ${disciplina.nome}`;
  let nome = `${base}.md`;
  for (let n = 2; await exists(path.join(vault.dir, vault.pastas.sessoes, nome)); n++) nome = `${base} ${n}.md`;
  const arquivo = path.join(vault.pastas.sessoes, nome);

  await mkdir(path.join(vault.dir, vault.pastas.sessoes), { recursive: true });
  await writeFile(path.join(vault.dir, arquivo), `---
tipo: sessao
data: ${sessao.data}
disciplina: ${disciplina.nome}
${topico ? `topico: ${yamlText(topico)}\n` : ""}atividade: ${sessao.atividade}
itens: ${sessao.itens}
acertos: ${sessao.acertos}
aproveitamento: ${aproveitamento}
proxima_revisao: ${revisao}
status: aberta
---

# ${disciplina.nome} — ${formatBR(sessao.data)}

${topico ? `Tópico: ${topico}\n\n` : ""}${sessao.acertos} de ${sessao.itens} (${aproveitamento}%). Próxima revisão em ${formatBR(revisao)}.

## Erros e observações

-
`, { flag: "wx" });

  // Uma revisão vencida conta como feita quando a nova sessão é da mesma
  // disciplina e do mesmo tópico (ou quando a sessão vencida não tinha tópico).
  const revisoesFechadas: string[] = [];
  for (const r of vault.registros) {
    if (
      r.tipo === "sessao" && r.status === "aberta" && r.disciplina === disciplina.nome &&
      (!r.topico || r.topico === topico) && r.proxima_revisao && r.proxima_revisao <= sessao.data
    ) {
      await setFrontmatter(path.join(vault.dir, r.arquivo), { status: "revisada" });
      r.status = "revisada";
      revisoesFechadas.push(r.arquivo);
    }
  }

  const aproveitamentos = vault.registros
    .filter((r) => r.tipo === "sessao" && r.disciplina === disciplina.nome && r.aproveitamento !== undefined)
    .map((r) => r.aproveitamento!)
    .concat(aproveitamento);
  const novoDominio = dominio(aproveitamentos);
  const novoStatus = novoDominio >= 4 ? "revisar" : disciplina.status === "diagnosticar" ? "estudar" : disciplina.status;
  await setFrontmatter(path.join(vault.dir, disciplina.arquivo), { status: novoStatus, dominio: String(novoDominio) });
  if (topico && sessao.atividade !== "diagnostico") await marcarTopico(path.join(vault.dir, disciplina.arquivo), topico);

  vault.registros.push({ arquivo, tipo: "sessao", data: sessao.data, disciplina: disciplina.nome, topico, aproveitamento, proxima_revisao: revisao, status: "aberta" });
  disciplina.dominio = novoDominio;
  disciplina.status = novoStatus;
  return { arquivo, aproveitamento, proxima_revisao: revisao, dominio: novoDominio, revisoesFechadas };
}

function renderConcurso(config: FloraConfig): string {
  const c = config.concurso;
  const total = totalQuestoes(c);
  return `---
schema: flora/modulo@1
id: modulo-${c.id}
tipo: modulo
titulo: ${yamlText(c.titulo)}
natureza: concurso
instituicao: ${yamlText(c.orgao)}
cargo: ${yamlText(c.cargo)}
${c.banca ? `banca: ${yamlText(c.banca)}\n` : ""}data_inicio: ${config.inicio}
data_alvo: ${c.data_prova}
status: ativo
assuntos:
${c.disciplinas.map((d) => `  - ${yamlText(d.nome)}`).join("\n")}
---

# ${c.titulo}

**${c.cargo}** · ${c.orgao}${c.banca ? ` · banca ${c.banca}` : ""} · prova em **${formatBR(c.data_prova)}**

- [Hoje](Hoje.md) — o que estudar agora (\`flora hoje --salvar\`)
- [Plano](Plano.md) — etapas e tempo por disciplina (\`flora plano\`)

## Disciplinas

| Disciplina | Questões | Peso |
| --- | --- | --- |
${c.disciplinas.map((d) => `| [${d.nome}](${encodeURI(`${PASTAS.disciplinas}/${d.nome}.md`)}) | ${d.questoes} | ${Math.round((d.questoes / total) * 100)}% |`).join("\n")}

## Fontes oficiais

${c.fontes.map((f) => `- [${f.titulo}](${f.url})`).join("\n")}

${c.validacao === "conferida" && c.verificado_em
    ? `Dados conferidos com o edital em ${formatBR(c.verificado_em)}. Sempre confira retificações no portal oficial.`
    : "**Atenção:** estes dados ainda não foram conferidos com o edital. Confira antes de confiar no plano."}
`;
}

function renderDisciplina(nome: string, questoes: number, total: number, topicos: string[]): string {
  return `---
tipo: disciplina
disciplina: ${yamlText(nome)}
questoes: ${questoes}
peso: ${Math.round((questoes / total) * 100)}
status: diagnosticar
dominio: 0
---

# ${nome}

${questoes} questões · ${Math.round((questoes / total) * 100)}% da prova

\`status\` segue diagnosticar → estudar → revisar, e \`dominio\` (0–5) é
recalculado a cada \`flora registrar\`. Um tópico fica marcado quando você
registra uma sessão sobre ele.

## Tópicos do edital

${topicos.map((t) => `- [ ] ${t}`).join("\n")}
`;
}

const LEIA_ME: Record<string, string> = {
  [PASTAS.sessoes]: `# Sessões

Uma nota por sessão, criada por \`flora registrar\`. A propriedade
\`proxima_revisao\` alimenta as revisões de \`flora hoje\`.
`,
  [PASTAS.erros]: `# Erros

Registre aqui só erros com chance de se repetir, uma nota por erro:

\`\`\`markdown
---
tipo: erro
disciplina: Nome da disciplina
causa: conteúdo | interpretação | procedimento | atenção | tempo
proxima_revisao: AAAA-MM-DD
status: aberto
---
\`\`\`

Quando acertar em dois dias diferentes, troque \`status\` para \`resolvido\`.
`,
};

function lerTopicos(content: string): { texto: string; feito: boolean }[] {
  return [...content.matchAll(/^- \[( |x|X)\] (.+)$/gm)].map((m) => ({ texto: m[2].trim(), feito: m[1] !== " " }));
}

async function marcarTopico(file: string, topico: string): Promise<void> {
  const content = await readFile(file, "utf8");
  const lines = content.split("\n").map((line) => {
    const m = line.match(/^- \[ \] (.+)$/);
    return m && m[1].trim() === topico ? `- [x] ${m[1]}` : line;
  });
  await writeFile(file, lines.join("\n"));
}

/** Atualiza campos simples do frontmatter, preservando o resto do arquivo. */
async function setFrontmatter(file: string, fields: Record<string, string>): Promise<void> {
  const lines = (await readFile(file, "utf8")).split("\n");
  const end = lines.indexOf("---", 1);
  if (lines[0] !== "---" || end === -1) throw new Error(`${file} não tem frontmatter`);
  for (const [key, value] of Object.entries(fields)) {
    const index = lines.slice(1, end).findIndex((line) => line.startsWith(`${key}:`));
    if (index >= 0) lines[index + 1] = `${key}: ${value}`;
    else lines.splice(end, 0, `${key}: ${value}`);
  }
  await writeFile(file, lines.join("\n"));
}

function yamlText(value: string): string {
  return /^[\p{L}\p{N}][\p{L}\p{N} .,()º°ª/–—-]*$/u.test(value) && !value.includes(": ") ? value : JSON.stringify(value);
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("pt-BR").trim();
}

async function exists(file: string): Promise<boolean> {
  return access(file).then(() => true, () => false);
}
