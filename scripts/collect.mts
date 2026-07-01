import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "node:fs/promises";
import path from "node:path";

const LIST_URL =
  "https://news.kicpa.or.kr/news/articleList.html?view_type=sm";
const articleUrl = (idxno: string) =>
  `https://news.kicpa.or.kr/news/articleView.html?idxno=${idxno}`;
const DATA_DIR = path.join(process.cwd(), "data");
const USER_AGENT = "Mozilla/5.0 (compatible; kicpa-news-digest/1.0; personal-use-script)";
const REQUEST_DELAY_MS = 700;

interface ListItem {
  idxno: string;
  title: string;
  source: string;
  publishedRaw: string;
}

interface CollectedArticle {
  idxno: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  collectedAt: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) {
    throw new Error(`요청 실패 (${res.status}): ${url}`);
  }
  return res.text();
}

function todayKst(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8",
  );
}

function parseList(html: string): ListItem[] {
  const $ = cheerio.load(html);
  const items: ListItem[] = [];
  $("#section-list li").each((_, el) => {
    const link = $(el).find("h2.titles a");
    const href = link.attr("href") ?? "";
    const match = href.match(/idxno=(\d+)/);
    if (!match) return;
    const title = link.text().trim().replace(/\s+/g, " ");
    const bylineDivs = $(el).find(".byline div");
    const source = bylineDivs.eq(0).text().trim();
    const publishedRaw = bylineDivs.eq(1).text().trim();
    items.push({ idxno: match[1], title, source, publishedRaw });
  });
  return items;
}

function extractBody(html: string): string {
  const $ = cheerio.load(html);
  $("#article-view-content-div script, #article-view-content-div style").remove();
  const text = $("#article-view-content-div").text();
  return text.replace(/\s+/g, " ").trim();
}

async function summarize(
  genAI: GoogleGenerativeAI,
  title: string,
  body: string,
): Promise<string> {
  // gemini-flash-latest는 항상 최신 무료 티어 Flash 모델을 가리키는 별칭
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  const prompt = [
    "다음은 회계/세무/경제 분야 뉴스 기사입니다.",
    "핵심 내용을 한국어 3문장 이내로 간결하게 요약해줘.",
    "서두나 부연설명 없이 요약 내용만 바로 작성해줘.",
    "",
    `제목: ${title}`,
    "",
    "본문:",
    body.slice(0, 6000),
  ].join("\n");

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  console.log(`목록 페이지 조회: ${LIST_URL}`);
  const listHtml = await fetchHtml(LIST_URL);
  const items = parseList(listHtml);
  console.log(`목록에서 ${items.length}건 확인`);

  const seen = new Set(await readJson<string[]>("seen.json", []));
  const newItems = items.filter((item) => !seen.has(item.idxno));
  console.log(`신규 기사 ${newItems.length}건`);

  const collected: CollectedArticle[] = [];

  for (const item of newItems) {
    const url = articleUrl(item.idxno);
    try {
      const articleHtml = await fetchHtml(url);
      const body = extractBody(articleHtml);
      if (!body) {
        console.warn(`본문을 찾을 수 없어 건너뜀: ${url}`);
      } else {
        const summary = await summarize(genAI, item.title, body);
        collected.push({
          idxno: item.idxno,
          title: item.title,
          url,
          source: item.source || "CPA뉴스",
          summary,
          collectedAt: new Date().toISOString(),
        });
        console.log(`요약 완료: ${item.title}`);
      }
    } catch (err) {
      console.error(`실패 (idxno=${item.idxno}):`, err);
    } finally {
      seen.add(item.idxno);
      await sleep(REQUEST_DELAY_MS);
    }
  }

  await writeJson("seen.json", Array.from(seen));

  if (collected.length === 0) {
    console.log("새로 저장할 기사가 없습니다.");
    return;
  }

  const date = todayKst();
  const existing = await readJson<CollectedArticle[]>(`${date}.json`, []);
  const merged = [...existing, ...collected];
  await writeJson(`${date}.json`, merged);

  const index = await readJson<string[]>("index.json", []);
  if (!index.includes(date)) {
    index.push(date);
    index.sort((a, b) => (a < b ? 1 : -1));
    await writeJson("index.json", index);
  }

  console.log(`${date}.json 에 ${collected.length}건 저장 완료`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
