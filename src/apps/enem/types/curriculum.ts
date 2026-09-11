export type KnowledgeAreaId = 'ciencias-natureza' | 'matematica' | 'ciencias-humanas' | 'linguagens';

export interface FormulaItem {
  id: string;
  name: string;
  latex: string;
  description: string;
  variables?: { symbol: string; meaning: string; unit?: string }[];
}

export type EnemWeight = 'Muito Alta' | 'Alta' | 'Média' | 'Baixa' | 'Contextual';

export interface DeepSectionItem {
  title: string;
  explanation: string;
  bullets?: string[];
}

export interface SubtopicItem {
  id: string;
  title: string;
  enemWeight?: EnemWeight;
  summary?: string;
  formulas?: FormulaItem[];
  keyConcepts?: string[];
  tips?: string[];
  deepSections?: DeepSectionItem[];
}

export interface TopicItem {
  id: string;
  title: string;
  description?: string;
  subtopics: SubtopicItem[];
}

export interface DisciplineItem {
  id: string;
  name: string;
  description: string;
  topics: TopicItem[];
}

export type Discipline = DisciplineItem;
export type Topic = TopicItem;
export type Subtopic = SubtopicItem;

export interface KnowledgeArea {
  id: KnowledgeAreaId;
  name: string;
  code: string;
  description: string;
  disciplines: DisciplineItem[];
}

export interface BreadcrumbPath {
  area: KnowledgeArea;
  discipline: DisciplineItem;
  topic: TopicItem;
  subtopic?: SubtopicItem;
  isAprofundado?: boolean;
}
