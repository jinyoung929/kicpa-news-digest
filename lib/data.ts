import fs from "node:fs";
import path from "node:path";

export interface Article {
  idxno: string;
  title: string;
  url: string;
  source: string;
  category?: string;
  summary: string;
  collectedAt: string;
  highlightTags?: string[];
}

const DATA_DIR = path.join(process.cwd(), "data");

export function getDigestDates(): string[] {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, "index.json"), "utf-8");
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function getDigest(date: string): Article[] {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, `${date}.json`), "utf-8");
    return JSON.parse(raw) as Article[];
  } catch {
    return [];
  }
}

export function groupByCategory(articles: Article[]): [string, Article[]][] {
  const groups = new Map<string, Article[]>();
  for (const article of articles) {
    const category = article.category || "기타";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push(article);
  }
  return Array.from(groups.entries());
}
