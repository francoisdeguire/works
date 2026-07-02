'use client'

import { RiArrowRightDownLine, RiArrowRightUpLine } from '@remixicon/react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import Preview from '@/components/mdx/preview'
import { Tabs, TabsList, TabsTrigger } from '@/components/mdx/preview-controls/tabs'
import { cn } from '@/lib/cn'

type View = 'colorful' | 'restrained'

type Role = 'Lead' | 'Senior' | 'Junior'
type Status = 'Working' | 'Offline'

type Rep = {
  name: string
  email: string
  role: Role
  status: Status
  conversion: number
  trend: 'up' | 'down'
  avatar: string
}

const reps = [
  {
    name: 'Dana Whitfield',
    email: 'dana@northwind.co',
    role: 'Lead',
    status: 'Offline',
    conversion: 12,
    trend: 'down',
    avatar: 'bg-violet-50 text-violet-900 outline-violet-900/10',
  },
  {
    name: 'Marcus Reed',
    email: 'marcus@northwind.co',
    role: 'Senior',
    status: 'Working',
    conversion: 34,
    trend: 'up',
    avatar: 'bg-pink-50 text-pink-900 outline-pink-900/10',
  },
  {
    name: 'Priya Nair',
    email: 'priya@northwind.co',
    role: 'Senior',
    status: 'Working',
    conversion: 41,
    trend: 'up',
    avatar: 'bg-indigo-50 text-indigo-900 outline-indigo-900/10',
  },
  {
    name: 'Tom Alvarez',
    email: 'tom@northwind.co',
    role: 'Junior',
    status: 'Working',
    conversion: 8,
    trend: 'up',
    avatar: 'bg-purple-50 text-purple-900 outline-purple-900/10',
  },
  {
    name: 'Sofia Klein',
    email: 'sofia@northwind.co',
    role: 'Junior',
    status: 'Offline',
    conversion: 27,
    trend: 'down',
    avatar: 'bg-fuchsia-50 text-fuchsia-900 outline-fuchsia-900/10',
  },
] satisfies Rep[]

/* Soft ring pills for roles: one hue each, so the column reads as confetti. */
const roleStyles: Record<Role, string> = {
  Lead: 'bg-blue-50 text-blue-900 outline-blue-900/10',
  Senior: 'bg-purple-50 text-purple-900 outline-purple-900/10',
  Junior: 'bg-lime-50 text-lime-900 outline-lime-900/10',
}

/* Solid-fill presence badges, loudest thing in the table, though nobody acts on them. */
const statusStyles: Record<Status, string> = {
  Working: 'bg-emerald-50 text-emerald-900 outline-emerald-900/15',
  Offline: 'bg-red-50 text-red-900 outline-red-900/15',
}

const easeEmphasized: [number, number, number, number] = [0.3, 0, 0, 1]

const tableMotion = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
  transition: { duration: 0.2, ease: easeEmphasized },
}

const th = 'px-3 py-2.5 font-semibold text-foreground'
const td = 'px-3 py-2.5 align-middle'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 gap-1.25 text-xs font-medium tracking-wide',
        className,
      )}
    >
      {children}
    </span>
  )
}

function Avatar({ name, avatar, view }: { name: string; avatar: string; view: View }) {
  return (
    <span
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold outline -outline-offset-1',
        view === 'colorful' ? avatar : 'bg-foreground/3 text-foreground-muted outline-foreground/5',
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}

function RoleCell({ role, view }: { role: Role; view: View }) {
  if (view === 'colorful') {
    return <Pill className={cn('outline -outline-offset-1', roleStyles[role])}>{role}</Pill>
  }
  return <span className="text-foreground-muted">{role}</span>
}

function StatusCell({ status, view }: { status: Status; view: View }) {
  if (view === 'colorful') {
    return (
      <Pill className={cn('outline -outline-offset-1', statusStyles[status])}>
        <div
          className={cn(
            'size-2 rounded-full',
            status === 'Working' ? 'bg-emerald-500' : 'bg-red-500',
          )}
        />
        <span>{status}</span>
      </Pill>
    )
  }
  return (
    <Pill className="outline -outline-offset-1 outline-border">
      <div
        className={cn(
          'size-2 rounded-full',
          status === 'Working' ? 'bg-sky-400' : 'ring ring-inset ring-zinc-300',
        )}
      />
      <span className={cn(status === 'Working' ? 'text-foreground' : 'text-foreground-muted')}>
        {status}
      </span>
    </Pill>
  )
}

function Conversion({ conversion, trend }: { conversion: number; trend: 'up' | 'down' }) {
  const Icon = trend === 'up' ? RiArrowRightUpLine : RiArrowRightDownLine
  return (
    <span
      className={cn(
        'inline-flex items-center justify-end gap-1 tabular-nums font-medium',
        trend === 'up' ? 'text-emerald-600' : 'text-red-600',
      )}
    >
      <Icon size={16} aria-hidden="true" />
      {conversion}%
    </span>
  )
}

export default function ColorDemo() {
  const [view, setView] = useState<View>('colorful')

  return (
    <>
      <Preview.Controls>
        <Tabs value={view} onValueChange={(value) => setView(value as View)}>
          <TabsList>
            <TabsTrigger value="colorful">Colorful</TabsTrigger>
            <TabsTrigger value="restrained">Restrained</TabsTrigger>
          </TabsList>
        </Tabs>
      </Preview.Controls>

      <div className="flex h-72 sm:h-96 items-center justify-center px-6 w-full">
        <AnimatePresence mode="wait">
          <motion.table
            key={view}
            {...tableMotion}
            className="text-left text-xs sm:text-sm text-foreground w-full max-sm:scale-75"
          >
            <thead>
              <tr className="border-b border-border">
                <th className={th}>Rep</th>
                <th className={th}>Role</th>
                <th className={th}>Status</th>
                <th className={cn(th, 'text-right')}>Conversion</th>
              </tr>
            </thead>
            <tbody>
              {reps.map((rep) => (
                <tr key={rep.name} className="border-b border-border-subtle">
                  <td className={td}>
                    <span className="flex items-center gap-3">
                      <Avatar name={rep.name} avatar={rep.avatar} view={view} />
                      <span className="flex flex-col gap-0.5">
                        <span className="font-medium">{rep.name}</span>
                        <span className="text-xs text-foreground-muted tracking-wide">
                          {rep.email}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className={td}>
                    <RoleCell role={rep.role} view={view} />
                  </td>
                  <td className={td}>
                    <StatusCell status={rep.status} view={view} />
                  </td>
                  <td className={cn(td, 'text-right')}>
                    <Conversion conversion={rep.conversion} trend={rep.trend} />
                  </td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        </AnimatePresence>
      </div>
    </>
  )
}
