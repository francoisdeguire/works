import type { ComponentType, LazyExoticComponent } from "react";

export interface Experiment {
  id: string;
  title: string;
  date: string;
  tags: string[];
  component: LazyExoticComponent<ComponentType>;
}

export const experiments: Experiment[] = [
  // Add experiments here:
  // {
  //   id: "toggle-demo",
  //   title: "Toggle Switch",
  //   date: "2026-04-01",
  //   tags: ["interaction", "motion"],
  //   component: lazy(() => import("./toggle-demo")),
  // },
];
