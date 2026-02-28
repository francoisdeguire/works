import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins multiple class name strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("omits falsy values (false, undefined, null)", () => {
    expect(cn("foo", false && "bar", undefined, null as never, "baz")).toBe(
      "foo baz",
    );
  });

  it("resolves conflicting Tailwind classes — last value wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("mx-auto", "mx-4")).toBe("mx-4");
  });

  it("handles arrays of class names", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("handles objects with boolean values", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("returns an empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("handles deeply nested conditional class merging", () => {
    const isActive = true;
    const isDisabled = false;
    expect(
      cn("base", isActive && "active", isDisabled && "disabled", "px-2 px-4"),
    ).toBe("base active px-4");
  });
});
