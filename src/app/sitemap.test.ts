import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/case-studies");

import { getAllCaseStudies } from "@/lib/case-studies";
import sitemap from "./sitemap";

const mockStudy = (overrides: Partial<{ slug: string; date: string }> = {}) => ({
  slug: "design-system-ai",
  title: "Design System AI",
  description: "A case study about design systems.",
  date: "2025-06-01",
  coverImage: "/images/cover.jpg",
  tags: ["design", "ai"],
  published: true,
  ...overrides,
});

describe("sitemap", () => {
  it("includes all required static routes", async () => {
    vi.mocked(getAllCaseStudies).mockResolvedValue([]);

    const result = await sitemap();
    const urls = result.map((e) => e.url);

    expect(urls).toContain("https://francois.works");
    expect(urls).toContain("https://francois.works/case-studies");
    expect(urls).toContain("https://francois.works/artifacts");
  });

  it("does not include /photography (intentionally excluded)", async () => {
    vi.mocked(getAllCaseStudies).mockResolvedValue([]);

    const result = await sitemap();
    const urls = result.map((e) => e.url);

    expect(urls).not.toContain("https://francois.works/photography");
  });

  it("includes a dynamic entry for each published case study", async () => {
    vi.mocked(getAllCaseStudies).mockResolvedValue([
      mockStudy({ slug: "design-system-ai" }),
      mockStudy({ slug: "another-case-study" }),
    ]);

    const result = await sitemap();
    const urls = result.map((e) => e.url);

    expect(urls).toContain(
      "https://francois.works/case-studies/design-system-ai",
    );
    expect(urls).toContain(
      "https://francois.works/case-studies/another-case-study",
    );
  });

  it("sets lastModified from the case study's date field", async () => {
    vi.mocked(getAllCaseStudies).mockResolvedValue([
      mockStudy({ slug: "design-system-ai", date: "2025-06-01" }),
    ]);

    const result = await sitemap();
    const entry = result.find((e) =>
      e.url.includes("design-system-ai"),
    );

    expect(entry?.lastModified).toEqual(new Date("2025-06-01"));
  });

  it("returns only static routes when there are no case studies", async () => {
    vi.mocked(getAllCaseStudies).mockResolvedValue([]);

    const result = await sitemap();

    // Should have exactly 3 entries: home, case-studies, artifacts
    expect(result).toHaveLength(3);
  });
});
