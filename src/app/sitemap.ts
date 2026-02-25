import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/case-studies";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const caseStudies = await getAllCaseStudies();

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `https://francois.works/case-studies/${study.slug}`,
    lastModified: new Date(study.date),
  }));

  return [
    { url: "https://francois.works", lastModified: new Date() },
    { url: "https://francois.works/case-studies", lastModified: new Date() },
    { url: "https://francois.works/artifacts", lastModified: new Date() },
    // Photography intentionally excluded
    ...caseStudyEntries,
  ];
}
