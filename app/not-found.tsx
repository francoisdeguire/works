"use client";

import { useBrowserPathname } from "@/hooks/use-browser-pathname";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const pathname = useBrowserPathname();
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        router.push("/");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <main id="main" className="relative h-dvh">
      <div className="reveal-down absolute bg-black top-0 left-0 w-full h-full z-50" />
      <div className="relative inset-0 py-[4ch] pl-[4ch] pr-[2ch] text-white leading-relaxed font-display uppercase text-[11px] sm:text-[22px] z-60">
        <div className="flex flex-col">
          {/*Section 1 */}
          <p className="appear-0">{`> LOAD FRANCOIS.WORKS${pathname}`}</p>

          {/*Section 2 */}
          <p className="appear-1 mt-[6ch] ">{`> ERR_404 : PAGE NOT FOUND`}</p>
          <p className="appear-1 mt-[1ch] ml-[2ch]">
            You're looking for something that doesn't exist.
          </p>
          <p className="appear-1 ml-[2ch] mt-[1ch]">CAUSE: UNRECOGNIZED PATH</p>

          {/*Section 3 */}
          <span className="appear-2 mt-[6ch]">
            {`> PRESS `}
            <Link href="/" className="blink">
              ENTER
            </Link>{" "}
            TO REBOOT
          </span>
        </div>
      </div>
    </main>
  );
}
