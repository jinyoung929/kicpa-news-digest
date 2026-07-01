import ArticleCard from "@/components/ArticleCard";
import { groupByCategory, type Article } from "@/lib/data";

export default function CategoryGroups({ articles }: { articles: Article[] }) {
  const groups = groupByCategory(articles);

  return (
    <div className="flex flex-col gap-8">
      {groups.map(([category, items]) => (
        <section key={category}>
          <h3 className="mb-3 text-xs font-semibold tracking-wide text-zinc-400 dark:text-zinc-500">
            {category} ({items.length})
          </h3>
          <div className="flex flex-col gap-4">
            {items.map((article) => (
              <ArticleCard key={article.idxno} article={article} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
