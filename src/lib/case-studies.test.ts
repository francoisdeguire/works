import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock node:fs before importing the module under test so vi.mock hoisting applies
vi.mock("node:fs");

import fs from "node:fs";
import { getAllCaseStudies, getCaseStudy } from "./case-studies";

// ---------------------------------------------------------------------------
// Fixture MDX content
// ---------------------------------------------------------------------------

const MDX_PUBLISHED = `---
title: Published Study
description: A published case study
date: "2025-06-01"
coverImage: /images/cover.jpg
tags: ["design", "ai"]
published: true
---

Content here.
`;

const MDX_UNPUBLISHED = `---
title: Draft Study
description: A draft case study
date: "2025-07-01"
coverImage: /images/cover2.jpg
tags: ["draft"]
published: false
---

Draft content.
`;

const MDX_OLDER_PUBLISHED = `---
title: Older Study
description: An older case study
date: "2024-01-01"
coverImage: /images/cover3.jpg
tags: ["older"]
published: true
---

Older content.
`;

// ---------------------------------------------------------------------------
// getAllCaseStudies
// ---------------------------------------------------------------------------

describe("getAllCaseStudies", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns an empty array when the content directory has no .mdx files", async () => {
    vi.mocked(fs.readdirSync).mockReturnValue([]);

    const result = await getAllCaseStudies();

    expect(result).toEqual([]);
  });

  it("filters out studies where published is false", async () => {
    vi.mocked(fs.readdirSync).mockReturnValue([
      "published.mdx",
      "draft.mdx",
    ] as unknown as fs.Dirent[]);
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      return String(filePath).includes("draft") ? MDX_UNPUBLISHED : MDX_PUBLISHED;
    });

    const result = await getAllCaseStudies();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Published Study");
  });

  it("sorts published studies by date descending (newest first)", async () => {
    vi.mocked(fs.readdirSync).mockReturnValue([
      "older.mdx",
      "published.mdx",
    ] as unknown as fs.Dirent[]);
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      return String(filePath).includes("older")
        ? MDX_OLDER_PUBLISHED
        : MDX_PUBLISHED;
    });

    const result = await getAllCaseStudies();

    expect(result[0].date).toBe("2025-06-01");
    expect(result[1].date).toBe("2024-01-01");
  });

  it("derives the slug from the filename without the .mdx extension", async () => {
    vi.mocked(fs.readdirSync).mockReturnValue([
      "design-system-ai.mdx",
    ] as unknown as fs.Dirent[]);
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_PUBLISHED);

    const result = await getAllCaseStudies();

    expect(result[0].slug).toBe("design-system-ai");
  });

  it("ignores non-.mdx files in the content directory", async () => {
    vi.mocked(fs.readdirSync).mockReturnValue([
      "published.mdx",
      "README.md",
      ".DS_Store",
    ] as unknown as fs.Dirent[]);
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_PUBLISHED);

    const result = await getAllCaseStudies();

    // Only the .mdx file should be processed
    expect(result).toHaveLength(1);
  });

  it("returns an empty array when all studies are unpublished", async () => {
    vi.mocked(fs.readdirSync).mockReturnValue([
      "draft-a.mdx",
      "draft-b.mdx",
    ] as unknown as fs.Dirent[]);
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_UNPUBLISHED);

    const result = await getAllCaseStudies();

    expect(result).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getCaseStudy
// ---------------------------------------------------------------------------

describe("getCaseStudy", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns null when the file does not exist", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const result = await getCaseStudy("non-existent");

    expect(result).toBeNull();
  });

  it("returns frontmatter and markdown source for a valid slug", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_PUBLISHED);

    const result = await getCaseStudy("published");

    expect(result).not.toBeNull();
    expect(result?.frontmatter.title).toBe("Published Study");
    expect(result?.frontmatter.description).toBe("A published case study");
    expect(result?.frontmatter.published).toBe(true);
    expect(result?.source).toContain("Content here.");
  });

  it("returns frontmatter even for an unpublished slug (no filtering here)", async () => {
    // getCaseStudy is a low-level lookup — it does NOT filter by published.
    // Filtering is done at the listing layer (getAllCaseStudies).
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_UNPUBLISHED);

    const result = await getCaseStudy("draft");

    expect(result?.frontmatter.published).toBe(false);
  });

  it("does not include frontmatter keys in the source string", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(MDX_PUBLISHED);

    const result = await getCaseStudy("published");

    // gray-matter strips the YAML block; source should only be the body
    expect(result?.source).not.toContain("published: true");
  });
});
