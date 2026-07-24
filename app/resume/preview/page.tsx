import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DefaultResume from '@/lib/resume/default'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ResumePrintPreview() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <div className="min-h-svh overflow-x-auto bg-neutral-200 pt-20 pb-16 print:bg-white print:pt-0 print:pb-0">
      <div className="mx-auto mb-5 flex w-[8.5in] items-center justify-between px-1 print:hidden">
        <p className="font-display text-[11px] uppercase tracking-widest text-neutral-500">
          Print preview
        </p>
      </div>

      <div className="relative mx-auto w-[8.5in] print:w-auto">
        <div
          data-paper
          className="min-h-[11in] bg-white p-[0.5in] shadow-xl ring-1 ring-black/5 print:min-h-0 print:p-0 print:shadow-none print:ring-0 pointer-events-none"
        >
          <DefaultResume />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[10.5in] border-t border-dashed border-red-400/80 print:hidden"
        >
          <span className="absolute -top-2.5 left-2 bg-red-400 px-1.5 py-px font-display text-[10px] uppercase tracking-wide text-white">
            page 1 ends
          </span>
        </div>
      </div>
    </div>
  )
}
