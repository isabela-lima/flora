import type { Concurso } from "./concurso.js";
import { addDays, daysBetween, formatBR, type Weekday } from "./dates.js";

export interface FloraConfig {
  versao: 1;
  inicio: string;
  horas_semana: number;
  dias: Weekday[];
  minutos_sessao: number;
  concurso: Concurso;
}

export type Fase = "diagnostico" | "estudo" | "revisao";

export interface Etapa {
  fase: Fase;
  nome: string;
  inicio: string;
  /** Último dia da etapa (inclusive). */
  fim: string;
  foco: string;
}

export interface CargaDisciplina {
  nome: string;
  questoes: number;
  dominio: number;
  /** Fração do tempo de estudo destinada à disciplina (0–1). */
  parcela: number;
  horas_semana: number;
}

const NOMES: Record<Fase, string> = {
  diagnostico: "Diagnóstico",
  estudo: "Estudo e prática",
  revisao: "Revisão e simulados",
};

const FOCOS: Record<Fase, string> = {
  diagnostico: "medir o ponto de partida de cada disciplina com questões, antes de montar a fila de teoria",
  estudo: "base curta seguida de prática, priorizando as disciplinas que valem mais e onde o domínio é menor",
  revisao: "prática mista, revisões vencidas e um simulado por semana nas condições da prova",
};

/**
 * Divide o período entre o início e a véspera da prova em três etapas:
 * cerca de 10% para diagnóstico (até 14 dias), 20% para revisão final e o
 * restante para estudo e prática.
 */
export function etapas(inicio: string, prova: string): Etapa[] {
  const total = daysBetween(inicio, prova);
  if (total <= 0) throw new Error(`a data de início (${formatBR(inicio)}) precisa ser antes da prova (${formatBR(prova)})`);

  let diagnostico: number;
  let revisao: number;
  if (total < 3) {
    diagnostico = 0;
    revisao = total;
  } else if (total < 10) {
    diagnostico = 1;
    revisao = Math.max(1, Math.floor(total * 0.3));
  } else {
    diagnostico = Math.min(14, Math.max(2, Math.round(total * 0.1)));
    revisao = Math.max(3, Math.round(total * 0.2));
  }
  const estudo = total - diagnostico - revisao;

  const result: Etapa[] = [];
  let cursor = inicio;
  for (const [fase, dias] of [["diagnostico", diagnostico], ["estudo", estudo], ["revisao", revisao]] as const) {
    if (dias <= 0) continue;
    result.push({ fase, nome: NOMES[fase], inicio: cursor, fim: addDays(cursor, dias - 1), foco: FOCOS[fase] });
    cursor = addDays(cursor, dias);
  }
  return result;
}

export function etapaEm(date: string, lista: Etapa[]): Etapa | undefined {
  return lista.find((etapa) => etapa.inicio <= date && date <= etapa.fim);
}

export function sessoesPorDia(config: FloraConfig): number {
  const minutosPorDia = (config.horas_semana * 60) / config.dias.length;
  return Math.max(1, Math.floor(minutosPorDia / config.minutos_sessao));
}

/**
 * Peso de cada disciplina: número de questões na prova, ampliado em até 2x
 * quando o domínio (0–5) é baixo. Assim, quem vale mais e é mais fraca recebe
 * mais tempo, sem abandonar as demais.
 */
export function cargas(
  config: FloraConfig,
  disciplinas: { nome: string; questoes: number; dominio: number }[],
): CargaDisciplina[] {
  const pesos = disciplinas.map((d) => d.questoes * (1 + (5 - clampDominio(d.dominio)) / 5));
  const soma = pesos.reduce((a, b) => a + b, 0);
  return disciplinas.map((d, index) => {
    const parcela = pesos[index] / soma;
    return {
      nome: d.nome,
      questoes: d.questoes,
      dominio: clampDominio(d.dominio),
      parcela,
      horas_semana: Math.round(config.horas_semana * parcela * 10) / 10,
    };
  });
}

function clampDominio(value: number): number {
  return Math.min(5, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function renderPlano(
  config: FloraConfig,
  disciplinas: { nome: string; questoes: number; dominio: number }[],
  geradoEm: string,
): string {
  const concurso = config.concurso;
  const lista = etapas(config.inicio, concurso.data_prova);
  const tabela = cargas(config, disciplinas)
    .sort((a, b) => b.parcela - a.parcela)
    .map((c) => `| ${c.nome} | ${c.questoes} | ${c.dominio} | ${Math.round(c.parcela * 100)}% | ${c.horas_semana} h |`);

  return `# Plano até a prova

${concurso.titulo} · prova em **${formatBR(concurso.data_prova)}** · ${daysBetween(geradoEm, concurso.data_prova)} dias a partir de ${formatBR(geradoEm)}

Rotina: **${config.horas_semana} h por semana** em ${config.dias.join(", ")}, ${sessoesPorDia(config)} sessão(ões) de ${config.minutos_sessao} min por dia.

## Etapas

| Etapa | De | Até | Foco |
| --- | --- | --- | --- |
${lista.map((e) => `| ${e.nome} | ${formatBR(e.inicio)} | ${formatBR(e.fim)} | ${e.foco} |`).join("\n")}

## Tempo por disciplina

O tempo segue o peso na prova e aumenta onde o domínio (0–5) é menor. Rode
\`flora plano\` de novo depois de registrar sessões para recalcular.

| Disciplina | Questões | Domínio | Parcela | Por semana |
| --- | --- | --- | --- | --- |
${tabela.join("\n")}

_Gerado por \`flora plano\` em ${formatBR(geradoEm)}. Edite \`flora.json\` para mudar horas ou dias._
`;
}
