import type { ReactNode } from "react";

export default function ArtifactDemoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div data-surface="dotted" className="min-h-screen">
      {children}
    </div>
  );
}
