import type { Article } from "@/lib/data";

export default function ArticleCard({ article }: { article: Article }) {
  const highlightTags = article.highlightTags ?? [];
  const isHighlighted = highlightTags.length > 0;

  return (
    <article
      className={`rounded-xl border bg-white p-5 shadow-sm dark:bg-zinc-900 ${
        isHighlighted
          ? "border-amber-300 ring-1 ring-amber-200 dark:border-amber-700 dark:ring-amber-900"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
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
        {highlightTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200"
          >
            {tag} 취준 주요뉴스
          </span>
        ))}
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
