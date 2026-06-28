import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cn } from '@/lib/cn'

function Button({ className, ...props }: ButtonPrimitive.Props) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        'flex h-9 gap-2 select-none items-center justify-center rounded-lg bg-background px-3 font-medium text-foreground text-sm ring ring-inset ring-border cursor-pointer',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 [&_svg]:opacity-80 has-[svg:first-child]:pl-2.5 has-[svg:last-child]:pr-2.5',
        'transition-[scale,background-color] duration-150 ease-emphasized hover:bg-gray-100 active:scale-[0.98]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dos',
        className,
      )}
      {...props}
    />
  )
}

export { Button }
