import fs from "node:fs";
import path from "node:path";

export interface Article {
  idxno: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  collectedAt: string;
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
