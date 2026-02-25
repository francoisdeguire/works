import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photography",
  robots: { index: false, follow: false },
};

export default function PhotographyPage() {
  return (
    <main>
      <h1>Photography</h1>
      <p>Coming soon.</p>
    </main>
  );
}
