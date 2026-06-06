import type { Editor } from '@tiptap/react'
import { Button, Tooltip } from 'antd'
import { Bold, Italic, Underline } from 'lucide-react'

interface Props {
  editor: Editor | null
}

export function EditorToolbar({ editor }: Props) {
  if (!editor) return null

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-1.5">
      <Tooltip title="Bold (Ctrl+B)">
        <Button
          type={editor.isActive('bold') ? 'primary' : 'text'}
          size="small"
          icon={<Bold size={13} />}
          onMouseDown={(e) => {
            e.preventDefault() // keep editor focused while clicking toolbar
            editor.chain().focus().toggleBold().run()
          }}
        />
      </Tooltip>
      <Tooltip title="Italic (Ctrl+I)">
        <Button
          type={editor.isActive('italic') ? 'primary' : 'text'}
          size="small"
          icon={<Italic size={13} />}
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleItalic().run()
          }}
        />
      </Tooltip>
      <Tooltip title="Underline (Ctrl+U)">
        <Button
          type={editor.isActive('underline') ? 'primary' : 'text'}
          size="small"
          icon={<Underline size={13} />}
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleUnderline().run()
          }}
        />
      </Tooltip>
      <span className="ml-auto text-xs text-gray-400">
        ← click variables on the right to insert
      </span>
    </div>
  )
}
