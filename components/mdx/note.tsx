import type { ReactNode } from 'react'

function Note({ children }: { children: ReactNode }) {
  return <aside className="mdx-note">{children}</aside>
}

function NoteTitle({ children }: { children: ReactNode }) {
  return <p className="mdx-note-title">{children}</p>
}

function NoteContent({ children }: { children: ReactNode }) {
  return <div className="mdx-note-body">{children}</div>
}

Note.Title = NoteTitle
Note.Content = NoteContent

export default Note
