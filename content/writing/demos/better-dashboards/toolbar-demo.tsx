'use client'

import { Menu } from '@base-ui/react/menu'
import { Tooltip } from '@base-ui/react/tooltip'
import {
  RiAddLine,
  RiArrowUpDownLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiEditLine,
  RiFilter3Line,
  RiMore2Fill,
  RiSearchLine,
} from '@remixicon/react'
import { AnimatePresence, motion } from 'motion/react'
import { type ComponentProps, type ReactNode, useState } from 'react'
import Preview from '@/components/mdx/preview'
import { Tabs, TabsList, TabsTrigger } from '@/components/mdx/preview-controls/tabs'
import { cn } from '@/lib/cn'

type View = 'flat' | 'ranked'

const utilityTooltip = Tooltip.createHandle<string>()

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'outline' | 'default'
  size?: 'md' | 'sm' | 'icon' | 'icon-sm'
}

function Button({ variant = 'default', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex cursor-pointer font-medium items-center justify-center transition-colors duration-150',
        {
          md: 'gap-1.5 rounded-lg px-3 h-8 text-sm',
          sm: 'gap-1 rounded-md px-2 py-1 h-7 text-xs',
          icon: 'size-8 rounded-lg',
          'icon-sm': 'size-7 rounded-md',
        }[size],
        {
          primary: 'bg-sky-500 text-white hover:bg-sky-600',
          outline: 'border border-border bg-background text-foreground hover:bg-muted',
          default:
            'text-foreground-muted hover:bg-muted hover:text-foreground data-popup-open:bg-muted data-popup-open:text-foreground',
        }[variant],
        className,
      )}
      {...props}
    />
  )
}

function SearchInput() {
  return (
    <label className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-background px-2.5 text-sm transition-colors focus-within:border-foreground-muted">
      <RiSearchLine size={16} className="shrink-0 text-foreground-muted" aria-hidden="true" />
      <input
        type="search"
        aria-label="Search"
        placeholder="Search"
        className="w-24 bg-transparent text-foreground outline-none placeholder:text-foreground-muted sm:w-32"
      />
    </label>
  )
}

function UtilityButton({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <Tooltip.Trigger
      handle={utilityTooltip}
      payload={label}
      aria-label={label}
      render={<Button size="icon" className={className} />}
    >
      {children}
    </Tooltip.Trigger>
  )
}

/* One shared root so the popup slides between triggers instead of remounting. */
function UtilityTooltip() {
  return (
    <Tooltip.Root handle={utilityTooltip}>
      {({ payload }) => (
        <Tooltip.Portal>
          <Tooltip.Positioner
            side="bottom"
            sideOffset={6}
            className="transition-[top,left,right,bottom,transform] duration-200 ease-standard data-instant:transition-none"
          >
            <Tooltip.Popup className="origin-(--transform-origin) rounded-md bg-foreground px-2 py-1 text-xs font-semibold tracking-wide text-background transition-[transform,opacity] duration-150 ease-standard data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none">
              {payload}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      )}
    </Tooltip.Root>
  )
}

function RowMenuItem({
  destructive = false,
  children,
}: {
  destructive?: boolean
  children: ReactNode
}) {
  return (
    <Menu.Item
      className={cn(
        'flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none',
        destructive
          ? 'text-red-600 data-highlighted:bg-red-500/10'
          : 'text-foreground data-highlighted:bg-surface-2',
      )}
    >
      {children}
    </Menu.Item>
  )
}

function RowMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger aria-label="Row actions" render={<Button size="icon-sm" />}>
        <RiMore2Fill size={20} aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end">
          <Menu.Popup className="min-w-36 origin-(--transform-origin) rounded-lg border border-border bg-background p-1 shadow-lg shadow-black/5 outline-none transition-[transform,opacity] duration-150 ease-standard data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0">
            <RowMenuItem>
              <RiEditLine size={16} aria-hidden="true" />
              Rename
            </RowMenuItem>
            <RowMenuItem>
              <RiDownloadLine size={16} aria-hidden="true" />
              Export
            </RowMenuItem>
            <Menu.Separator className="mx-1 my-1 h-px bg-border-subtle" />
            <RowMenuItem destructive>
              <RiDeleteBinLine size={16} aria-hidden="true" />
              Delete
            </RowMenuItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export default function ToolbarDemo() {
  const [view, setView] = useState<View>('flat')

  return (
    <>
      <Preview.Controls>
        <Tabs value={view} onValueChange={(value) => setView(value as View)}>
          <TabsList>
            <TabsTrigger value="flat">Flat</TabsTrigger>
            <TabsTrigger value="ranked">Ranked</TabsTrigger>
          </TabsList>
        </Tabs>
      </Preview.Controls>

      {/* Top-right corner of a larger screen; left and bottom edges bleed out of the crop. */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
            transition={{ duration: 0.2, ease: [0.3, 0, 0, 1] }}
            className="absolute -left-16 sm:-left-24 -bottom-10 top-10 right-6 sm:top-12 sm:right-12 flex flex-col rounded-tr-2xl border border-border bg-background p-5 shadow-sm"
          >
            <Tooltip.Provider delay={200}>
              <div className="flex flex-col items-end gap-8">
                <Button variant={view === 'flat' ? 'outline' : 'primary'}>
                  <RiAddLine size={16} aria-hidden="true" />
                  Upload File
                </Button>
                <div className="flex items-center gap-1.5">
                  <SearchInput />
                  {view === 'flat' ? (
                    <>
                      <Button variant="outline">
                        <RiArrowUpDownLine size={16} aria-hidden="true" />
                        Sort
                      </Button>
                      <Button variant="outline">
                        <RiFilter3Line size={16} aria-hidden="true" />
                        Filter
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 ml-1">
                      <UtilityButton label="Filter">
                        <RiFilter3Line size={18} aria-hidden="true" />
                      </UtilityButton>
                      <UtilityButton label="Sort">
                        <RiArrowUpDownLine size={18} aria-hidden="true" />
                      </UtilityButton>
                      <UtilityTooltip />
                    </div>
                  )}
                </div>
              </div>
            </Tooltip.Provider>
            <div className="mt-4 -mb-5 -ml-5 flex-1 overflow-hidden border-t border-border-subtle">
              {['w-56', 'w-40', 'w-64', 'w-48'].map((width) => (
                <div
                  key={width}
                  className="flex items-center justify-between gap-4 border-b border-border-subtle py-2"
                >
                  <div className={cn('h-3 rounded-full bg-gray-100', width)} />
                  <div className="flex items-center gap-1.5">
                    {view === 'flat' ? (
                      <>
                        <Button variant="outline" size="sm" aria-label="Export">
                          <RiDownloadLine size={16} aria-hidden="true" />
                          Export
                        </Button>
                        <Button variant="outline" size="icon-sm" aria-label="Delete">
                          <RiEditLine size={16} aria-hidden="true" />
                        </Button>
                        <Button variant="outline" size="icon-sm" aria-label="Delete">
                          <RiDeleteBinLine size={16} aria-hidden="true" />
                        </Button>
                      </>
                    ) : (
                      <RowMenu />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
