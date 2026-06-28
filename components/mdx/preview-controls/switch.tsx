'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'

import { cn } from '@/lib/cn'

function Switch({ className, children, id, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 font-medium text-foreground text-sm shrink-0"
    >
      <SwitchPrimitive.Root
        id={id}
        data-slot="switch"
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-black/10 p-0.5 outline outline-black/5 -outline-offset-1 transition-colors duration-150 ease-standard data-checked:bg-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-dos focus-visible:outline-offset-2',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className="block size-5 rounded-full border border-black/10 bg-white shadow transition-transform duration-150 ease-standard data-checked:translate-x-5"
        />
      </SwitchPrimitive.Root>
      {children}
    </label>
  )
}

export { Switch }
