import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cn } from '@/lib/cn'

function Button({ className, ...props }: ButtonPrimitive.Props) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        'flex h-9 select-none items-center justify-center rounded-lg bg-background px-3 font-medium text-foreground text-sm ring ring-inset ring-foreground/5 cursor-pointer',
        'transition-[scale,background-color] duration-150 ease-emphasized hover:bg-gray-100 active:scale-[0.98]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dos',
        className,
      )}
      {...props}
    />
  )
}

export { Button }
