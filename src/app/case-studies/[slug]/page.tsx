import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllCaseStudies, getCaseStudy } from "@/lib/case-studies";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const studies = await getAllCaseStudies();
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const study = await getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.frontmatter.title,
    description: study.frontmatter.description,
  };
}

export default async function CaseStudyPage(props: { params: Params }) {
  const { slug } = await props.params;
  const study = await getCaseStudy(slug);

  if (!study) notFound();

  return (
    <article>
      <header>
        <h1>{study.frontmatter.title}</h1>
        <p>{study.frontmatter.description}</p>
      </header>
      <MDXRemote source={study.source} />
    </article>
  );
}
