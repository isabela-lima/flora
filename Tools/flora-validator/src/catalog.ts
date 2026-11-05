import {
  readVersionedRecords,
  type Frontmatter,
  type RecordEntry,
} from "./validate.js";

export interface FloraCatalog {
  modules: RecordEntry[];
  sources: RecordEntry[];
  questions: RecordEntry[];
}

export interface DailyContext {
  topic: string;
  modules: Frontmatter[];
  sources: Frontmatter[];
  questions: Frontmatter[];
}

export async function loadCatalog(vaultRoot: string): Promise<FloraCatalog> {
  const { records } = await readVersionedRecords(vaultRoot);
  return {
    modules: records.filter((record) => record.data.schema === "flora/modulo@1"),
    sources: records.filter((record) => record.data.schema === "flora/fonte@1"),
    questions: records.filter((record) => record.data.schema === "flora/questao@1"),
  };
}

export function selectVerifiedQuestions(
  catalog: FloraCatalog,
  topic?: string,
): RecordEntry[] {
  const sourcesById = new Map(
    catalog.sources
      .filter((source) => typeof source.data.id === "string")
      .map((source) => [source.data.id as string, source.data]),
  );
  const normalizedTopic = topic ? normalize(topic) : undefined;

  return catalog.questions.filter((question) => {
    const data = question.data;
    if (data.validacao !== "conferida") return false;
    if (normalizedTopic && !normalize(String(data.assunto ?? "")).includes(normalizedTopic)) {
      return false;
    }
    const sourceIds = Array.isArray(data.fontes) ? data.fontes : [];
    return sourceIds.length > 0 && sourceIds.every((id) =>
      typeof id === "string" && sourcesById.get(id)?.validacao === "conferida"
    );
  });
}

export function buildDailyContext(catalog: FloraCatalog, topic: string): DailyContext {
  const selectedQuestions = selectVerifiedQuestions(catalog, topic);
  const sourceIds = new Set(
    selectedQuestions.flatMap((question) =>
      Array.isArray(question.data.fontes) ? question.data.fontes : []
    ).filter((id): id is string => typeof id === "string"),
  );
  const moduleIds = new Set(
    selectedQuestions.flatMap((question) =>
      Array.isArray(question.data.modulos) ? question.data.modulos : []
    ).filter((id): id is string => typeof id === "string"),
  );

  return {
    topic,
    modules: catalog.modules
      .filter((module) => typeof module.data.id === "string" && moduleIds.has(module.data.id))
      .map(toPublicRecord),
    sources: catalog.sources
      .filter((source) => typeof source.data.id === "string" && sourceIds.has(source.data.id))
      .map(toPublicRecord),
    questions: selectedQuestions.map(toPublicRecord),
  };
}

function toPublicRecord(record: RecordEntry): Frontmatter {
  return { file: record.file, ...record.data };
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("pt-BR").trim();
}
