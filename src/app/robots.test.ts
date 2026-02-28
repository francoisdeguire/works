import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows all user agents to crawl everything", () => {
    const result = robots();

    expect(result.rules).toMatchObject({
      userAgent: "*",
      allow: "/",
    });
  });

  it("does not add a disallow rule", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

    for (const rule of rules) {
      expect(rule).not.toHaveProperty("disallow");
    }
  });

  it("points to the correct sitemap URL", () => {
    const result = robots();

    expect(result.sitemap).toBe("https://francois.works/sitemap.xml");
  });
});
