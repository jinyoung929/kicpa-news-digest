import type { Article } from "@/lib/data";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {article.source}
        </span>
        <span>·</span>
        <time dateTime={article.collectedAt}>
          {new Date(article.collectedAt).toLocaleString("ko-KR", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
      <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {article.title}
        </a>
      </h2>
      <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {article.summary}
      </p>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:underline dark:text-zinc-400"
      >
        원문 보기 ({article.source}) →
      </a>
    </article>
  );
}
