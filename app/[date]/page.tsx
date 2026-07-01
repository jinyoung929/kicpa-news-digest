import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryGroups from "@/components/CategoryGroups";
import { getDigest, getDigestDates } from "@/lib/data";

export function generateStaticParams() {
  return getDigestDates().map((date) => ({ date }));
}

export const dynamicParams = false;

export default async function DigestPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const dates = getDigestDates();
  if (!dates.includes(date)) {
    notFound();
  }
  const articles = getDigest(date);
  const index = dates.indexOf(date);
  const prevDate = dates[index + 1];
  const nextDate = dates[index - 1];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
      <header className="mb-8">
        <Link
          href="/"
          className="text-xs text-zinc-400 hover:underline dark:text-zinc-500"
        >
          ← 최신 다이제스트
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {date} 다이제스트
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {articles.length}건의 기사가 수집되었습니다.
        </p>
      </header>

      <CategoryGroups articles={articles} />

      <div className="mt-8 flex justify-between text-sm">
        {prevDate ? (
          <Link href={`/${prevDate}`} className="hover:underline">
            ← {prevDate}
          </Link>
        ) : (
          <span />
        )}
        {nextDate && (
          <Link href={`/${nextDate}`} className="hover:underline">
            {nextDate} →
          </Link>
        )}
      </div>
    </main>
  );
}
