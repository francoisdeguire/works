'use client'

import './player.css'
import { cn } from '@/lib/cn'
import { Button, Divider } from './components/buttons'
import { FastForwardIcon, PlayIcon, StopIcon } from './components/icons'
import { Meter } from './components/meter'
import { Reel } from './components/reel'
import { Screen } from './components/screen'
import { useTurntable } from './use-turntable'

const TRACK_URL = '/artifacts/player/track.mp3'
const TRACK_NAME = 'solo - KETTAMA remix (PREVIEW)'
// speaker grille, bottom row first: a right triangle of holes; precomputed with
// stable keys so the holes avoid array-index keys
const GRILLE_ROWS = [5, 4, 3, 2, 1].map((count) => ({
  id: `row-${count}`,
  holes: Array.from({ length: count }, (_, i) => `hole-${count}-${i}`),
}))

export default function Player() {
  const { playing, ffHeld, rotation, levels, position, duration, scrub, transport } =
    useTurntable(TRACK_URL)

  return (
    <div className="player-root font-light">
      <div className="player-bevel relative h-138 w-96 rounded-2xl ring ring-black/10">
        <span className="absolute top-5 left-5 select-none text-2xl text-zinc-700 leading-none tracking-wider">
          MP–7
        </span>
        {/* Screen: scrolling track name over the tape counter */}
        <Screen
          name={TRACK_NAME}
          position={position}
          duration={duration}
          ff={ffHeld}
          className="absolute top-3 right-3"
        />

        <div className="absolute top-7 left-1/2 flex -translate-x-1/2 gap-8">
          <div className="player-bevel player-bevel-hole size-1.5 rounded-full" />
          <div className="player-bevel player-bevel-hole size-1.5 rounded-full" />
        </div>

        <div className="select-none absolute top-20 right-3.5 flex size-4 items-center justify-center bg-orange-400 pt-px text-sm text-zinc-200 leading-none">
          M
        </div>

        {/* Restart */}
        <div className="player-bevel player-bevel-well absolute top-16 left-6 size-7 rounded-full [--player-bevel-width:1px]">
          <button
            type="button"
            aria-label="restart"
            onClick={transport.restart}
            className="player-bevel absolute inset-px flex cursor-pointer items-center justify-center rounded-full pt-px text-sm leading-none transition-colors duration-200 [--player-bevel-width:1px] active:after:absolute active:after:-inset-px active:after:rounded-full active:after:bg-black/5"
          >
            <span className="select-none text-zinc-400">R</span>
          </button>
        </div>

        {/* playback indicator */}
        <div className="absolute bottom-39 left-7 flex items-end gap-1">
          <div
            className={cn(
              'player-bevel player-bevel-hole size-4 rounded-full',
              playing
                ? '[--player-bevel-face:linear-gradient(var(--color-red-500),var(--color-red-400))]'
                : '[--player-bevel-face:linear-gradient(var(--color-zinc-500),var(--color-zinc-400))]',
            )}
          >
            <div
              className={cn(
                'absolute inset-0.5 rounded-full bg-orange-300/80 blur-[2px]',
                !playing && 'hidden',
              )}
            />
          </div>
        </div>

        {/* speaker grille: right triangle of drilled holes, right-aligned and
            growing upward; each rim catches light on the body's bevel axis */}
        <div className="absolute right-6 bottom-38 flex flex-col-reverse items-end gap-1">
          {GRILLE_ROWS.map((row) => (
            <div key={row.id} className="flex gap-1">
              {row.holes.map((hole) => (
                <div key={hole} className="player-bevel player-bevel-hole size-1.75 rounded-full" />
              ))}
            </div>
          ))}
        </div>

        <Reel rotation={rotation} scrub={scrub} />

        {/* buttons container: negative offsets cancel the bevel border so it stays flush with the body edge */}
        <div className="absolute -bottom-0.5 -left-0.5 h-32 w-3/4 overflow-clip rounded-tr-md rounded-bl-2xl bg-zinc-600">
          <div className="player-bevel player-bevel-buttons absolute top-0.75 right-0.75 bottom-0 left-0 flex rounded-tr-sm rounded-bl-2xl">
            <Button
              position="first"
              label="play"
              pressed={playing}
              rightPressed={ffHeld}
              onClick={transport.play}
            >
              <PlayIcon />
            </Button>
            <Divider variant="gradient" />
            <Button
              position="middle"
              label="fast-forward"
              leftPressed={playing}
              onPressStart={transport.startFastForward}
              onPressEnd={transport.stopFastForward}
            >
              <FastForwardIcon />
            </Button>
            <Divider variant="solid" />
            <Button position="last" label="stop" onPressStart={transport.stop}>
              <StopIcon />
            </Button>
          </div>
        </div>
        {/* VU meter: stereo LED stacks in recessed frosted slots, top 4 red for clipping */}
        <Meter levels={levels} className="absolute right-8 bottom-5" />
      </div>
    </div>
  )
}
