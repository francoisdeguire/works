'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'

import { cn } from '@/lib/cn'

function Tabs({ className, orientation = 'horizontal', ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn('group/tabs', className)}
      {...props}
    />
  )
}

function TabsList({ className, children, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'relative flex h-9 select-none items-center justify-center gap-0.5 rounded-full bg-background p-1 border',
        className,
      )}
      {...props}
    >
      <TabsIndicator />
      {children}
    </TabsPrimitive.List>
  )
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        'pointer-events-none absolute left-0 top-0 rounded-full bg-gray-100 ring-1 ring-border-subtle',
        'h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top)',
        'transition-[translate,width,height] duration-150 ease-standard',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        'relative z-10 flex h-full items-center justify-center cursor-pointer rounded-full px-2.5 font-medium text-sm transition-colors duration-200 ease-out hover:text-foreground text-foreground-muted data-active:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
