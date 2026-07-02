'use client'

import { useState } from 'react'
import Preview from '@/components/mdx/preview'
import Slider from '@/components/mdx/preview-controls/slider'
import { Switch } from '@/components/mdx/preview-controls/switch'
import { cn } from '@/lib/cn'

const SIZES = [
  { name: 'xs', className: 'progressive-blur-xs' },
  { name: 'sm', className: 'progressive-blur-sm' },
  { name: 'md', className: 'progressive-blur-md' },
  { name: 'lg', className: 'progressive-blur-lg' },
  { name: 'xl', className: 'progressive-blur-xl' },
] as const

export default function ProgressiveBlurDemo() {
  const [size, setSize] = useState(2)
  const [scrim, setScrim] = useState(true)

  const current = SIZES[size] ?? SIZES[3]

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="relative h-96 w-full rounded-lg overflow-hidden isolate bg-surface-2">
          <div className="h-full w-full overflow-y-scroll">
            <div className="px-6 sm:px-16 py-12 sm:py-24 font-sans text-foreground-muted text-sm tracking-wide leading-relaxed flex flex-col items-center gap-8">
              <p className="text-center">
                Scroll down to see the progressive blur effect in action.
              </p>
              <div className="h-16 w-px bg-foreground/20 shrink-0" />
              <p className="text-center text-pretty">
                Ah! what splendid sunsets they beheld during those weekly strolls. The sun
                accompanied them, as it were, amid the throbbing gaiety of the quays, the river
                life, the dancing ripples of the currents; amid the attractions of the shops, as
                warm as conservatories, the flowers sold by the seed merchants, and the noisy cages
                of the bird fanciers; amid all the din of sound and wealth of colour which ever make
                a city’s waterside its youthful part. As they proceeded, the ardent blaze of the
                western sky turned to purple on their left, above the dark line of houses, and the
                orb of day seemed to wait for them, falling gradually lower, slowly rolling towards
                the distant roofs when once they had passed the Pont Notre-Dame in front of the
                widening stream. In no ancient forest, on no mountain road, beyond no grassy plain
                will there ever be such triumphal sunsets as behind the cupola of the Institute. It
                is there one sees Paris retiring to rest in all her glory. At each of their walks
                the aspect of the conflagration changed; fresh furnaces added their glow to the
                crown of flames. One evening, when a shower had surprised them, the sun, showing
                behind the downpour, lit up the whole rain cloud, and upon their heads there fell a
                spray of glowing water, irisated with pink and azure. On the days when the sky was
                clear, however, the sun, like a fiery ball, descended majestically in an unruffled
                sapphire lake; for a moment the black cupola of the Institute seemed to cut away
                part of it and make it look like the waning moon; then the globe assumed a violet
                tinge and at last became submerged in the lake, which had turned blood-red. Already,
                in February, the planet described a wider curve, and fell straight into the Seine,
                which seemed to seethe on the horizon as at the contact of red-hot iron. However,
                the grander scenes, the vast fairy pictures of space only blazed on cloudy evenings.
                Then, according to the whim of the wind, there were seas of sulphur splashing
                against coral reefs; there were palaces and towers, marvels of architecture, piled
                upon one another, burning and crumbling, and throwing torrents of lava from their
                many gaps; or else the orb which had disappeared, hidden by a veil of clouds,
                suddenly transpierced that veil with such a press of light that shafts of sparks
                shot forth from one horizon to the other, showing as plainly as a volley of golden
                arrows. And then the twilight fell, and they said good-bye to each other, while
                their eyes were still full of the final dazzlement. They felt that triumphal Paris
                was the accomplice of the joy which they could not exhaust, the joy of ever resuming
                together that walk beside the old stone parapets.
              </p>
            </div>
            <div className="pointer-events-none sticky bottom-0 -mt-28 h-28 w-full">
              <div
                className={cn(
                  'progressive-blur h-full w-full rotate-180 rounded-t-lg',
                  current.className,
                  scrim && 'progressive-blur-scrim-surface-2',
                )}
              >
                <div className="[--blur-layer:1]" />
                <div className="[--blur-layer:2]" />
                <div className="[--blur-layer:3]" />
                <div className="[--blur-layer:4]" />
                <div className="[--blur-layer:5]" />
                <div className="[--blur-layer:6]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Preview.Controls>
        <Slider
          label="Blur amount"
          min={0}
          max={SIZES.length - 1}
          step={1}
          value={size}
          onValueChange={setSize}
          formatValue={(value) => (SIZES[value] ?? SIZES[0]).name}
        />
        <span className="h-6 w-px shrink-0 bg-foreground/10" />
        <Switch checked={scrim} onCheckedChange={(checked) => setScrim(checked)}>
          Scrim Overlay
        </Switch>
      </Preview.Controls>
    </>
  )
}
