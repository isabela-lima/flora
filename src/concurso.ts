import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { isDate } from "./dates.js";

export interface Disciplina {
  nome: string;
  questoes: number;
  topicos: string[];
}

export interface FonteConcurso {
  titulo: string;
  url: string;
  categoria: string;
}

export interface Concurso {
  id: string;
  titulo: string;
  orgao: string;
  cargo: string;
  banca?: string;
  data_prova: string;
  fontes: FonteConcurso[];
  disciplinas: Disciplina[];
  validacao: "pendente" | "conferida";
  verificado_em?: string;
}

/** Lê todos os concursos do catálogo (uma pasta com um arquivo JSON por concurso). */
export async function loadConcursos(directory: string): Promise<Concurso[]> {
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json")).sort();
  const concursos: Concurso[] = [];
  for (const file of files) {
    const data = JSON.parse(await readFile(path.join(directory, file), "utf8")) as unknown;
    const problems = checkConcurso(data);
    if (problems.length > 0) {
      throw new Error(`${file}: ${problems.join("; ")}`);
    }
    const concurso = data as Concurso;
    if (`${concurso.id}.json` !== file) {
      throw new Error(`${file}: o nome do arquivo deve ser ${concurso.id}.json`);
    }
    concursos.push(concurso);
  }
  return concursos;
}

export async function findConcurso(directory: string, id: string): Promise<Concurso> {
  const concursos = await loadConcursos(directory);
  const found = concursos.find((concurso) => concurso.id === id);
  if (!found) {
    const ids = concursos.map((concurso) => concurso.id).join(", ");
    throw new Error(`concurso "${id}" não está no catálogo. Disponíveis: ${ids}`);
  }
  return found;
}

/** Devolve a lista de problemas encontrados; vazia quando o concurso é válido. */
export function checkConcurso(data: unknown): string[] {
  const problems: string[] = [];
  if (typeof data !== "object" || data === null) return ["deve ser um objeto JSON"];
  const value = data as Record<string, unknown>;
  const text = (field: string): void => {
    if (typeof value[field] !== "string" || (value[field] as string).trim() === "") {
      problems.push(`${field} deve ser texto não vazio`);
    }
  };

  text("id");
  text("titulo");
  text("orgao");
  text("cargo");
  if (typeof value.id === "string" && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value.id)) {
    problems.push("id deve usar só letras minúsculas, números e hífens");
  }
  if (!isDate(value.data_prova)) problems.push("data_prova deve ser uma data YYYY-MM-DD");
  if (value.verificado_em !== undefined && !isDate(value.verificado_em)) {
    problems.push("verificado_em deve ser uma data YYYY-MM-DD");
  }
  if (value.validacao !== "pendente" && value.validacao !== "conferida") {
    problems.push("validacao deve ser pendente ou conferida");
  }

  if (!Array.isArray(value.fontes) || value.fontes.length === 0) {
    problems.push("fontes deve listar ao menos o edital");
  } else {
    for (const [index, fonte] of value.fontes.entries()) {
      const item = fonte as Record<string, unknown>;
      if (typeof item?.titulo !== "string" || typeof item?.categoria !== "string") {
        problems.push(`fontes[${index}] precisa de titulo e categoria`);
      }
      try {
        new URL(String(item?.url));
      } catch {
        problems.push(`fontes[${index}].url deve ser uma URL válida`);
      }
    }
  }

  if (!Array.isArray(value.disciplinas) || value.disciplinas.length === 0) {
    problems.push("disciplinas deve ter ao menos uma disciplina");
  } else {
    const names = new Set<string>();
    for (const [index, disciplina] of value.disciplinas.entries()) {
      const item = disciplina as Record<string, unknown>;
      if (typeof item?.nome !== "string" || item.nome.trim() === "") {
        problems.push(`disciplinas[${index}].nome deve ser texto não vazio`);
      } else if (names.has(item.nome)) {
        problems.push(`disciplina repetida: ${item.nome}`);
      } else if (/[\\/:*?"<>|]/.test(item.nome)) {
        problems.push(`disciplinas[${index}].nome não pode ter \\ / : * ? " < > |`);
      } else {
        names.add(item.nome);
      }
      if (!Number.isInteger(item?.questoes) || (item.questoes as number) < 1) {
        problems.push(`disciplinas[${index}].questoes deve ser inteiro positivo`);
      }
      if (
        !Array.isArray(item?.topicos) || item.topicos.length === 0 ||
        item.topicos.some((topico) => typeof topico !== "string" || topico.trim() === "")
      ) {
        problems.push(`disciplinas[${index}].topicos deve ser uma lista de textos`);
      }
    }
  }
  return problems;
}

export function totalQuestoes(concurso: Concurso): number {
  return concurso.disciplinas.reduce((sum, disciplina) => sum + disciplina.questoes, 0);
}
