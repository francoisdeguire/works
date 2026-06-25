'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { RiCheckLine } from '@remixicon/react'

import { cn } from '@/lib/cn'

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <label
      htmlFor={props.id}
      className="flex items-center gap-2 text-sm font-medium text-foreground"
    >
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        className={cn(
          'peer relative flex size-5 shrink-0 items-center justify-center rounded cursor-pointer border border-input transition-colors group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-foreground data-checked:bg-foreground data-checked:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dos',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none [&>svg]:size-4"
        >
          <RiCheckLine aria-hidden />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {props.children}
    </label>
  )
}

export { Checkbox }
