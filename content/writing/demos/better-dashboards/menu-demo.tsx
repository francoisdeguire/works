'use client'

import { Menu } from '@base-ui/react/menu'
import {
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiEditLine,
  RiMenu2Line,
} from '@remixicon/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

function itemClass(animated: boolean, destructive = false) {
  return cn(
    'flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none',
    destructive
      ? 'text-red-600 data-highlighted:bg-red-500/10'
      : 'text-foreground data-highlighted:bg-surface-2',
    animated && 'transition-colors duration-300',
  )
}

function popupClass(animated: boolean) {
  return cn(
    'min-w-36 origin-(--transform-origin) rounded-lg border border-border bg-background p-1 shadow-lg shadow-black/5 outline-none',
    animated &&
      'transition-[translate,scale,opacity] duration-400 ease-standard data-starting-style:-translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:duration-200 data-ending-style:-translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0',
  )
}

function DemoMenuItem({
  animated,
  destructive = false,
  children,
}: {
  animated: boolean
  destructive?: boolean
  children: ReactNode
}) {
  return <Menu.Item className={itemClass(animated, destructive)}>{children}</Menu.Item>
}

function ExportSubmenu({ animated }: { animated: boolean }) {
  return (
    <Menu.SubmenuRoot>
      <Menu.SubmenuTrigger className={cn(itemClass(animated), 'data-popup-open:bg-surface-2')}>
        <RiDownloadLine size={16} aria-hidden="true" />
        Export as
        <RiArrowRightSLine size={16} className="ml-auto text-foreground-muted" aria-hidden="true" />
      </Menu.SubmenuTrigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup className={popupClass(animated)}>
            <DemoMenuItem animated={animated}>CSV</DemoMenuItem>
            <DemoMenuItem animated={animated}>PDF</DemoMenuItem>
            <DemoMenuItem animated={animated}>PNG</DemoMenuItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.SubmenuRoot>
  )
}

function DemoMenu({ animated }: { animated: boolean }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          'inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-muted data-popup-open:bg-muted sm:h-9 sm:px-3',
          animated && 'transition-colors duration-300',
        )}
      >
        <RiMenu2Line size={16} aria-hidden="true" />
        Menu
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6}>
          <Menu.Popup className={popupClass(animated)}>
            <DemoMenuItem animated={animated}>
              <RiEditLine size={16} aria-hidden="true" />
              Rename
            </DemoMenuItem>
            <ExportSubmenu animated={animated} />
            <Menu.Separator className="mx-1 my-1 h-px bg-border-subtle" />
            <DemoMenuItem animated={animated} destructive>
              <RiDeleteBinLine size={16} aria-hidden="true" />
              Delete
            </DemoMenuItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

function DemoPane({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn('relative grid h-60 place-items-center sm:h-64', className)}>
      <span className="absolute top-6 text-xs font-medium uppercase tracking-wider text-foreground-muted">
        {label}
      </span>
      {children}
    </section>
  )
}

export default function MenuDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <DemoPane label="Animated">
        <DemoMenu animated />
      </DemoPane>
      <DemoPane label="Minimal" className="border-t border-border-subtle sm:border-t-0 sm:border-l">
        <DemoMenu animated={false} />
      </DemoPane>
    </div>
  )
}
