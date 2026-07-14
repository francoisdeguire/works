'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { TodoItem } from './components/item'
import { manrope } from './font'
import './scribble-strikethrough.css'

type Task = { id: string; text: string; done: boolean }

// the offsite item wraps to two lines
const INITIAL: Task[] = [
  { id: '1', text: 'Reply to Sarah', done: false },
  { id: '2', text: 'Book dentist appointment', done: false },
  {
    id: '3',
    text: 'Check with Alan for flights and hotel for the offsite',
    done: false,
  },
  { id: '4', text: 'Pick up groceries', done: false },
  { id: '5', text: 'Water the plants', done: false },
]

export default function ScribbleStrikethrough() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL)

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  return (
    <section
      className={cn(
        'scribble-root sm:w-full max-w-100 rounded-4xl bg-white outline-1 -outline-offset-1 outline-black/10 px-4 py-6 shadow-xs sm:px-10 sm:py-12',
        manrope.variable,
      )}
    >
      <header className="mb-6 flex items-baseline justify-between px-3 sm:mb-8 sm:px-4">
        <h1 className="font-bold text-2xl text-zinc-900 tracking-tight sm:text-3xl">
          Today's Tasks
        </h1>
      </header>

      <ul className="flex flex-col">
        {tasks.map((task) => (
          <li key={task.id}>
            <TodoItem text={task.text} done={task.done} onToggle={() => toggle(task.id)} />
          </li>
        ))}
      </ul>
    </section>
  )
}
