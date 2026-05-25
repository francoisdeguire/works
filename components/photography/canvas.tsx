"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Photo } from "@/lib/photography";
import {
  BUFFER,
  CELL_MOBILE,
  cellAt,
  cellJitter,
  type CellRange,
  JITTER_RATIO,
  pickCellSize,
  sameRange,
  visibleCells,
} from "@/lib/photography-math";
import { Cell } from "./cell";
import { usePan } from "./use-pan";

type CanvasProps = { photos: Photo[] };

export function PhotographyCanvas({ photos }: CanvasProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // dirtyRef gates the RAF loop. Pan + inertia + keyboard flip it true;
  // the RAF clears it after one frame's work. Idle frames are pure no-ops.
  const dirtyRef = useRef(true);
  const centeredRef = useRef(false);
  const { offsetRef, isPanning } = usePan(surfaceRef, containerRef, dirtyRef);

  const [seed, setSeed] = useState<number | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [cellSize, setCellSize] = useState(CELL_MOBILE);
  const [visible, setVisible] = useState<CellRange | null>(null);
  const [centeredKey, setCenteredKey] = useState<string | null>(null);
  // Snapshots of the prior viewport/cellSize so resize can rescale the pan
  // offset around the viewport center — otherwise every cellSize change
  // shifts the focused photo (world coords scale, screen offset doesn't).
  const prevSyncRef = useRef<{ w: number; h: number; cell: number } | null>(
    null,
  );

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 0x7fffffff));
    const sync = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      const newCell = pickCellSize(newW);
      const prev = prevSyncRef.current;

      if (prev !== null) {
        // World coord at the OLD viewport center (in old cell units).
        const worldX = prev.w / 2 - offsetRef.current.x;
        const worldY = prev.h / 2 - offsetRef.current.y;
        // The lattice scales linearly with cellSize (every cell origin is
        // col * cellSize + jitter * cellSize), so all world coords scale
        // by the same ratio. Translate the focus point through that scale,
        // then re-center it in the new viewport.
        const scale = newCell / prev.cell;
        offsetRef.current = {
          x: newW / 2 - worldX * scale,
          y: newH / 2 - worldY * scale,
        };
        dirtyRef.current = true;
      }

      prevSyncRef.current = { w: newW, h: newH, cell: newCell };
      setViewport({ w: newW, h: newH });
      setCellSize(newCell);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [offsetRef]);

  // Center a random cell exactly once on first hydration. Re-centering on
  // every viewport resize would disorient a user who's mid-pan. The jitter
  // for the chosen cell is subtracted so the photo (centered inside its
  // cell box) actually lands at viewport center, not center + jitter.
  useEffect(() => {
    if (seed === null || viewport.w === 0 || centeredRef.current) return;
    const cs = cellSize;
    const centerCol = Math.floor((Math.random() - 0.5) * 20);
    const centerRow = Math.floor((Math.random() - 0.5) * 20);
    const jx = cellJitter(centerCol, centerRow, seed, "x") * JITTER_RATIO * cs;
    const jy = cellJitter(centerCol, centerRow, seed, "y") * JITTER_RATIO * cs;
    offsetRef.current = {
      x: viewport.w / 2 - centerCol * cs - jx - cs / 2,
      y: viewport.h / 2 - centerRow * cs - jy - cs / 2,
    };
    setCenteredKey(`${centerCol},${centerRow}`);
    centeredRef.current = true;
    dirtyRef.current = true;
  }, [seed, viewport.w, viewport.h, cellSize, offsetRef]);

  useEffect(() => {
    if (seed === null || viewport.w === 0) return;
    const vw = viewport.w;
    const vh = viewport.h;
    let raf = 0;
    const tick = () => {
      if (dirtyRef.current) {
        const o = offsetRef.current;
        if (containerRef.current) {
          containerRef.current.style.transform = `translate3d(${o.x}px, ${o.y}px, 0)`;
        }
        const next = visibleCells(o, { w: vw, h: vh }, cellSize, BUFFER);
        setVisible((prev) => (sameRange(prev, next) ? prev : next));
        dirtyRef.current = false;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seed, viewport.w, viewport.h, cellSize, offsetRef]);

  useEffect(() => {
    if (seed === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowLeft") dx = cellSize;
      else if (e.key === "ArrowRight") dx = -cellSize;
      else if (e.key === "ArrowUp") dy = cellSize;
      else if (e.key === "ArrowDown") dy = -cellSize;
      else return;
      e.preventDefault();
      offsetRef.current = {
        x: offsetRef.current.x + dx,
        y: offsetRef.current.y + dy,
      };
      dirtyRef.current = true;
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [seed, cellSize, offsetRef]);

  // Surface div renders unconditionally so usePan's effect can attach
  // listeners on first mount. If it were conditional, surfaceRef.current
  // would be null when the effect fires and pointer events would never
  // get wired up (ref objects don't change identity → effect doesn't re-run).
  const cells: ReactNode[] = [];
  if (seed !== null && viewport.w > 0 && visible) {
    for (let row = visible.rowMin; row <= visible.rowMax; row++) {
      for (let col = visible.colMin; col <= visible.colMax; col++) {
        const key = `${col},${row}`;
        const c = cellAt(col, row, seed, photos, cellSize);
        cells.push(
          <Cell
            key={key}
            photo={c.photo}
            x={c.x}
            y={c.y}
            cellSize={cellSize}
            loading={key === centeredKey ? "eager" : "lazy"}
          />,
        );
      }
    }
  }

  return (
    <div
      ref={surfaceRef}
      className={cn(
        "relative min-h-screen w-full touch-none overflow-hidden select-none",
        isPanning ? "cursor-grabbing" : "cursor-grab",
      )}
      role="application"
      aria-label="Photography canvas — drag to pan"
    >
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 motion-safe:transition-opacity motion-safe:delay-200 motion-safe:duration-600 motion-safe:ease-standard",
          visible !== null
            ? "opacity-100"
            : "opacity-0 motion-reduce:opacity-100",
        )}
      >
        {cells}
      </div>
    </div>
  );
}
