import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { getDigest, getDigestDates } from "@/lib/data";

export const dynamic = "force-static";

export default function Home() {
  const dates = getDigestDates();
  const latestDate = dates[0];
  const articles = latestDate ? getDigest(latestDate) : [];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          CPA뉴스 데일리 다이제스트
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          매일 오전 7시, news.kicpa.or.kr에 올라온 새 기사를 요약해드립니다.
        </p>
      </header>

      {!latestDate ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          아직 수집된 다이제스트가 없습니다. 첫 자동 수집이 실행되면 이곳에 표시됩니다.
        </p>
      ) : (
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {latestDate} 다이제스트 ({articles.length}건)
            </h2>
            {dates.length > 1 && (
              <Link
                href={`/${dates[1]}`}
                className="text-xs text-zinc-400 hover:underline dark:text-zinc-500"
              >
                이전 기록 보기 →
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.idxno} article={article} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
