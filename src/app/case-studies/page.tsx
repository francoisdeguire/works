import type { Metadata } from "next";
import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Selected work and case studies by Francois Deguire.",
};

export default async function CaseStudiesPage() {
  const caseStudies = await getAllCaseStudies();

  return (
    <main>
      <h1>Case Studies</h1>
      <ul>
        {caseStudies.map((study) => (
          <li key={study.slug}>
            <Link href={`/case-studies/${study.slug}`}>
              <h2>{study.title}</h2>
              <p>{study.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
