import { Slider as SliderPrimitive } from '@base-ui/react/slider'

type SliderControlProps = {
  label: string
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number) => void
  formatValue?: (value: number) => string
}

export default function Slider({
  label,
  formatValue,
  onValueChange,
  ...props
}: SliderControlProps) {
  return (
    <SliderPrimitive.Root
      className="mb-1.5 flex w-full flex-col gap-3"
      onValueChange={(value) => onValueChange?.(value as number)}
      {...props}
    >
      <div className="flex w-full items-center justify-between text-sm font-medium">
        <SliderPrimitive.Label>{label}</SliderPrimitive.Label>
        <SliderPrimitive.Value className="tabular-nums text-foreground-muted">
          {formatValue ? (_, values) => formatValue(values[0] ?? 0) : null}
        </SliderPrimitive.Value>
      </div>
      <SliderPrimitive.Control className="flex w-full items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:flex-col">
        <SliderPrimitive.Track className="relative grow rounded-full outline outline-black/5 -outline-offset-1 data-[orientation=horizontal]:h-2 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-2 bg-black/5 data-dragging:cursor-grabbing">
          <SliderPrimitive.Indicator className="bg-neutral-950 rounded-full select-none" />
          <SliderPrimitive.Thumb className="relative bg-white block size-5 border border-black/10 shrink-0 rounded-full shadow before:absolute before:-inset-3 before:content-[''] data-disabled:pointer-events-none has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-dos cursor-grab data-dragging:cursor-grabbing" />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}
