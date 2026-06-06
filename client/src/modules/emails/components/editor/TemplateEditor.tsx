import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { VariableChipExtension } from './VariableChipExtension'
import { EditorToolbar } from './EditorToolbar'
import { VariableSidebar } from './VariableSidebar'

/** Convert {{varName}} mustache tokens → chip-parseable HTML for TipTap */
function mustacheToHtml(text: string): string {
  return text.replace(
    /\{\{(\w+)\}\}/g,
    (_, name) => `<span data-variable="${name}">${name}</span>`,
  )
}

/** Convert TipTap chip HTML → {{varName}} mustache tokens for storage */
function htmlToMustache(html: string): string {
  return html.replace(/<span\s[^>]*data-variable="(\w+)"[^>]*>.*?<\/span>/g, '{{$1}}')
}

interface Props {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export function TemplateEditor({ value = '', onChange, disabled = false }: Props) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Track the last value we pushed to onChange to prevent sync loops
  const lastEmittedRef = useRef(value)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      VariableChipExtension,
    ],
    content: mustacheToHtml(value),
    editable: !disabled,
    onUpdate({ editor: e }) {
      const mustache = e.isEmpty ? '' : htmlToMustache(e.getHTML())
      lastEmittedRef.current = mustache
      onChangeRef.current?.(mustache)
    },
  })

  // Sync when the form pushes a new value (e.g. loading a different template to edit)
  useEffect(() => {
    if (!editor) return
    if (value === lastEmittedRef.current) return // we emitted this — skip to prevent loop
    lastEmittedRef.current = value
    editor.commands.setContent(mustacheToHtml(value))
  }, [editor, value])

  // Toggle editable state when disabled changes
  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [editor, disabled])

  return (
    <>
      <style>{`
        .ProseMirror { outline: none; }
        .ProseMirror p { margin: 0 0 6px 0; }
        .ProseMirror p:last-child { margin-bottom: 0; }
      `}</style>
      <div
        className="overflow-hidden rounded-lg border border-gray-300"
        style={{ display: 'grid', gridTemplateColumns: '1fr 200px' }}
      >
        {/* Left: toolbar + editable area */}
        <div className="flex flex-col">
          <EditorToolbar editor={editor} />
          <EditorContent
            editor={editor}
            className="flex-1 overflow-y-auto bg-white px-4 py-3"
            style={{ minHeight: 220 }}
          />
        </div>

        {/* Right: variable chips + formatting guide */}
        <VariableSidebar editor={editor} />
      </div>
    </>
  )
}
