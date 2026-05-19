import Image from "next/image";
import type { ReactNode } from "react";

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  children?: ReactNode;
};

export default function Figure({
  src,
  alt,
  width,
  height,
  children,
}: FigureProps) {
  return (
    <figure>
      <Image src={src} alt={alt} width={width} height={height} />
      {children}
    </figure>
  );
}
