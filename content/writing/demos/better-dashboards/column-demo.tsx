'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import Preview from '@/components/mdx/preview'
import { Tabs, TabsList, TabsTrigger } from '@/components/mdx/preview-controls/tabs'
import { cn } from '@/lib/cn'

type View = 'flat' | 'combined'

type Customer = {
  name: string
  street: string
  city: string
  state: string
  zip: string
}

const customers = [
  {
    name: 'Adequate Systems',
    street: '1226 University Dr',
    city: 'Menlo Park',
    state: 'CA',
    zip: '94025',
  },
  {
    name: 'Reasonable Robotics',
    street: '500 5th Ave',
    city: 'New York',
    state: 'NY',
    zip: '10018',
  },
  { name: 'Nominal Dynamics', street: '72 Elm Ave', city: 'Austin', state: 'TX', zip: '78701' },
  {
    name: 'Fair Enough Inc.',
    street: '88 Lakeshore Blvd',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
  },
] satisfies Customer[]

const easeEmphasized: [number, number, number, number] = [0.3, 0, 0, 1]

const tableMotion = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
  transition: { duration: 0.2, ease: easeEmphasized },
}

const th = 'px-3 py-2.5 font-semibold text-foreground'
const td = 'px-3 py-2.5 align-middle'

function Kebab() {
  return (
    <button
      type="button"
      aria-label="Row actions"
      className="inline-flex size-7 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="5" r="1.6" />
        <circle cx="12" cy="12" r="1.6" />
        <circle cx="12" cy="19" r="1.6" />
      </svg>
    </button>
  )
}

export default function ColumnDemo() {
  const [view, setView] = useState<View>('flat')

  return (
    <>
      <Preview.Controls>
        <Tabs value={view} onValueChange={(value) => setView(value as View)}>
          <TabsList>
            <TabsTrigger value="flat">Flat</TabsTrigger>
            <TabsTrigger value="combined">Combined</TabsTrigger>
          </TabsList>
        </Tabs>
      </Preview.Controls>

      <div className="flex h-80 sm:h-96 items-center justify-center px-6 w-full max-sm:scale-90">
        <AnimatePresence mode="wait">
          <motion.table
            key={view}
            {...tableMotion}
            className="text-left text-[11px] sm:text-[13px] text-foreground w-full"
          >
            <thead>
              <tr className="border-b border-border">
                <th className={th}>Customer</th>
                {view === 'flat' ? (
                  <>
                    <th className={th}>Street</th>
                    <th className={th}>City</th>
                    <th className={th}>State</th>
                    <th className={th}>Zip</th>
                  </>
                ) : (
                  <th className={th}>Address</th>
                )}
                <th className={cn(th, 'w-10')}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.name} className="border-b border-border-subtle">
                  <td className={cn(td, 'font-medium')}>{c.name}</td>
                  {view === 'flat' ? (
                    <>
                      <td className={cn(td)}>{c.street}</td>
                      <td className={cn(td)}>{c.city}</td>
                      <td className={cn(td)}>{c.state}</td>
                      <td className={cn(td)}>{c.zip}</td>
                    </>
                  ) : (
                    <td className={td}>
                      <div className="text-foreground">{c.street}</div>
                      <div className="mt-0.5 text-xs text-foreground-muted">
                        {c.city}, {c.state} {c.zip}
                      </div>
                    </td>
                  )}
                  <td className={cn(td, 'text-right')}>
                    <Kebab />
                  </td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        </AnimatePresence>
      </div>
    </>
  )
}
