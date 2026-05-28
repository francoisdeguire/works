import ArtifactTile from "@/components/artifacts/artifact-tile";
import type { Artifact } from "@/lib/artifacts";

type ArtifactGridProps = {
  artifacts: Artifact[];
};

export default function ArtifactGrid({ artifacts }: ArtifactGridProps) {
  return (
    <p className="mt-16 sm:mt-32 text-center font-display text-sm uppercase text-foreground-muted">
      Coming soon
    </p>
  );

  return (
    <ul className="mt-16 grid grid-cols-1 -mx-2 gap-3 sm:mt-24 sm:grid-cols-2">
      {artifacts.map((artifact) => (
        <li key={artifact.slug}>
          <ArtifactTile artifact={artifact} />
        </li>
      ))}
    </ul>
  );
}
