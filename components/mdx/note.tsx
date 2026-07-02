import type { ReactNode } from 'react'

function NoteRoot({ children }: { children: ReactNode }) {
  return <aside className="mdx-note">{children}</aside>
}

function NoteTitle({ children }: { children: ReactNode }) {
  return <h4 className="mdx-note-title">{children}</h4>
}

function NoteContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

const Note = Object.assign(NoteRoot, {
  Title: NoteTitle,
  Content: NoteContent,
})

export default Note
