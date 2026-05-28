import type { Metadata } from "next";
import PageTitle from "@/components/page-title";
import ArticleList from "@/components/writing/article-list";
import { getAllArticles } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles about code, design and life.",
  alternates: { canonical: "/writing" },
  openGraph: {
    title: "Writing – Francois Deguire",
    description: "Articles about code, design and life.",
    url: "/writing",
  },
};

export default async function WritingPage() {
  const articles = await getAllArticles();
  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[90ch] px-5 pt-[30svh] sm:px-6 sm:pb-48"
    >
      <PageTitle
        title="Writing"
        subtitle="Articles about Code, Design and Life"
      />
      <ArticleList articles={articles} />
    </main>
  );
}
