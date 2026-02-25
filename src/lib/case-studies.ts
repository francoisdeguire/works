import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface CaseStudyFrontmatter {
  title: string;
  description: string;
  date: string;
  coverImage: string;
  tags: string[];
  published: boolean;
}

export interface CaseStudyMeta extends CaseStudyFrontmatter {
  slug: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export async function getAllCaseStudies(): Promise<CaseStudyMeta[]> {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const studies = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
    const { data } = matter(raw);
    return { slug, ...(data as CaseStudyFrontmatter) };
  });

  return studies
    .filter((s) => s.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getCaseStudy(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: data as CaseStudyFrontmatter,
    source: content,
  };
}
