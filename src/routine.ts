import { addDays, daysBetween, formatBR, weekday } from "./dates.js";
import { cargas, etapaEm, etapas, sessoesPorDia, type Fase, type FloraConfig } from "./plan.js";

export interface Topico {
  texto: string;
  feito: boolean;
}

export interface DisciplinaEstado {
  nome: string;
  questoes: number;
  status: string;
  dominio: number;
  topicos: Topico[];
  arquivo: string;
}

export interface Registro {
  arquivo: string;
  tipo: string;
  data?: string;
  disciplina?: string;
  topico?: string;
  aproveitamento?: number;
  proxima_revisao?: string;
  status?: string;
}

export type Atividade = "diagnostico" | "estudo" | "pratica" | "simulado";

export interface Aula {
  disciplina?: string;
  topico?: string;
  atividade: Atividade;
  minutos: number;
  roteiro: string[];
}

export interface Hoje {
  data: string;
  concurso: string;
  prova: string;
  dias_para_prova: number;
  fase?: Fase;
  fase_nome?: string;
  dia_de_estudo: boolean;
  revisoes: Registro[];
  aulas: Aula[];
}

const ROTULOS: Record<Atividade, string> = {
  diagnostico: "diagnóstico",
  estudo: "estudo",
  pratica: "prática",
  simulado: "simulado",
};

const ROTEIROS: Record<Atividade, string[]> = {
  diagnostico: [
    "resolva de 10 a 15 questões da disciplina sem consultar nada",
    "anote os tópicos em que hesitou ou errou",
    "registre o resultado com `flora registrar`",
  ],
  estudo: [
    "5 min — recuperação: escreva tudo o que lembra do tópico, sem consulta",
    "25 min — prática: resolva questões ou um exercício",
    "10 min — correção: entenda a causa de cada erro e consulte só o necessário",
    "5 min — fechamento: registre o resultado com `flora registrar`",
  ],
  pratica: [
    "5 min — recuperação sem consulta",
    "30 min — questões misturando tópicos da disciplina",
    "10 min — correção e registro com `flora registrar`",
  ],
  simulado: [
    "faça um simulado nas condições da prova (tempo e número de questões)",
    "corrija no mesmo dia e anote acertos por disciplina",
    "registre cada disciplina com `flora registrar --atividade simulado`",
  ],
};

/** Monta o dia: revisões vencidas e as aulas escolhidas pelo plano. */
export function montarHoje(
  data: string,
  config: FloraConfig,
  disciplinas: DisciplinaEstado[],
  registros: Registro[],
): Hoje {
  const prova = config.concurso.data_prova;
  const lista = data < prova && data >= config.inicio ? etapas(config.inicio, prova) : [];
  const etapa = etapaEm(data, lista);
  const diaDeEstudo = etapa !== undefined && config.dias.includes(weekday(data));

  return {
    data,
    concurso: config.concurso.titulo,
    prova,
    dias_para_prova: daysBetween(data, prova),
    fase: etapa?.fase,
    fase_nome: etapa?.nome,
    dia_de_estudo: diaDeEstudo,
    revisoes: revisoesVencidas(data, registros),
    aulas: diaDeEstudo && etapa ? escolherAulas(data, etapa.fase, config, disciplinas, registros) : [],
  };
}

export function revisoesVencidas(data: string, registros: Registro[]): Registro[] {
  return registros
    .filter((r) => r.proxima_revisao && r.proxima_revisao <= data && r.status !== "resolvido" && r.status !== "revisada")
    .sort((a, b) => String(a.proxima_revisao).localeCompare(String(b.proxima_revisao)));
}

function escolherAulas(
  data: string,
  fase: Fase,
  config: FloraConfig,
  disciplinas: DisciplinaEstado[],
  registros: Registro[],
): Aula[] {
  const slots = sessoesPorDia(config);
  const minutos = config.minutos_sessao;

  if (fase === "revisao" && weekday(data) === config.dias[config.dias.length - 1]) {
    return [{ atividade: "simulado", minutos: minutos * slots, roteiro: ROTEIROS.simulado }];
  }

  const aulas: Aula[] = [];
  if (fase === "diagnostico") {
    const pendentes = disciplinas
      .filter((d) => d.status === "diagnosticar")
      .sort((a, b) => b.questoes - a.questoes || a.nome.localeCompare(b.nome));
    for (const d of pendentes.slice(0, slots)) {
      aulas.push({ disciplina: d.nome, atividade: "diagnostico", minutos, roteiro: ROTEIROS.diagnostico });
    }
  }

  // Rodízio ponderado: escolhe a disciplina mais "atrasada" em relação à sua parcela.
  const parcelas = new Map(cargas(config, disciplinas).map((c) => [c.nome, c.parcela]));
  const feitas = new Map(disciplinas.map((d) => [d.nome, 0]));
  for (const r of registros) {
    if (r.tipo === "sessao" && r.disciplina && feitas.has(r.disciplina)) {
      feitas.set(r.disciplina, (feitas.get(r.disciplina) ?? 0) + 1);
    }
  }
  for (const aula of aulas) feitas.set(aula.disciplina!, (feitas.get(aula.disciplina!) ?? 0) + 1);
  const topicosUsados = new Set<string>();
  const atividade: Atividade = fase === "revisao" ? "pratica" : "estudo";

  while (aulas.length < slots && disciplinas.length > 0) {
    const total = [...feitas.values()].reduce((a, b) => a + b, 0) + 1;
    // Intercalação: evita repetir a disciplina no mesmo dia enquanto houver outras.
    const hojeJa = new Set(aulas.map((aula) => aula.disciplina));
    const candidatas = disciplinas.filter((d) => !hojeJa.has(d.nome));
    const escolhida = [...(candidatas.length > 0 ? candidatas : disciplinas)].sort((a, b) => {
      const atrasoA = (parcelas.get(a.nome) ?? 0) * total - (feitas.get(a.nome) ?? 0);
      const atrasoB = (parcelas.get(b.nome) ?? 0) * total - (feitas.get(b.nome) ?? 0);
      return atrasoB - atrasoA || b.questoes - a.questoes || a.nome.localeCompare(b.nome);
    })[0];
    feitas.set(escolhida.nome, (feitas.get(escolhida.nome) ?? 0) + 1);

    const topico = escolhida.topicos.find((t) => !t.feito && !topicosUsados.has(`${escolhida.nome}/${t.texto}`));
    if (topico) topicosUsados.add(`${escolhida.nome}/${topico.texto}`);
    aulas.push({
      disciplina: escolhida.nome,
      topico: topico?.texto,
      atividade: topico ? atividade : "pratica",
      minutos,
      roteiro: ROTEIROS[topico ? atividade : "pratica"],
    });
  }
  return aulas;
}

/** Intervalo de revisão pelo desempenho, como no método: 1, 7 ou 21 dias. */
export function proximaRevisao(data: string, aproveitamento: number): string {
  if (aproveitamento < 60) return addDays(data, 1);
  if (aproveitamento < 80) return addDays(data, 7);
  return addDays(data, 21);
}

/** Domínio de 0 a 5 a partir da média de aproveitamento das sessões. */
export function dominio(aproveitamentos: number[]): number {
  if (aproveitamentos.length === 0) return 0;
  const media = aproveitamentos.reduce((a, b) => a + b, 0) / aproveitamentos.length;
  return Math.min(5, Math.max(0, Math.round(media / 20)));
}

export function renderHoje(hoje: Hoje): string {
  const linhas = [`# Hoje — ${formatBR(hoje.data)}`, ""];
  if (hoje.dias_para_prova < 0) {
    linhas.push(`A prova de ${hoje.concurso} já passou. Rode \`flora iniciar\` com um novo concurso.`);
    return linhas.join("\n") + "\n";
  }
  if (hoje.dias_para_prova === 0) {
    linhas.push(`Hoje é a prova de ${hoje.concurso}. Nada de conteúdo novo: descanse, revise a logística e boa prova!`);
    return linhas.join("\n") + "\n";
  }
  const faltam = hoje.dias_para_prova === 1 ? "falta **1 dia**" : `faltam **${hoje.dias_para_prova} dias**`;
  linhas.push(
    `${hoje.concurso} · ${faltam} para a prova${hoje.fase_nome ? ` · etapa: **${hoje.fase_nome}**` : ""}`,
    "",
    "## Revisões vencidas",
    "",
  );
  if (hoje.revisoes.length === 0) {
    linhas.push("Nenhuma revisão pendente.");
  } else {
    for (const r of hoje.revisoes) {
      const assunto = [r.disciplina, r.topico].filter(Boolean).join(" · ") || r.arquivo;
      linhas.push(`- [${assunto}](${encodeURI(r.arquivo)}) — venceu em ${formatBR(r.proxima_revisao!)}. Comece sem consultar a teoria.`);
    }
  }

  linhas.push("", "## Aulas", "");
  if (!hoje.dia_de_estudo) {
    linhas.push("Hoje não é dia de estudo na sua rotina. Se sobrar tempo, faça só as revisões.");
  }
  hoje.aulas.forEach((aula, index) => {
    const titulo = aula.atividade === "simulado"
      ? "Simulado"
      : `${aula.disciplina} — ${ROTULOS[aula.atividade]}${aula.topico ? `: ${aula.topico}` : ""}`;
    linhas.push(`### ${index + 1}. ${titulo} (${aula.minutos} min)`, "");
    for (const passo of aula.roteiro) linhas.push(`- ${passo}`);
    if (aula.disciplina) {
      const topico = aula.topico ? ` --topico "${aula.topico}"` : "";
      linhas.push("", "```bash", `flora registrar --disciplina "${aula.disciplina}"${topico} --atividade ${aula.atividade} --itens 10 --acertos 7`, "```");
    }
    linhas.push("");
  });
  return linhas.join("\n").trimEnd() + "\n";
}
