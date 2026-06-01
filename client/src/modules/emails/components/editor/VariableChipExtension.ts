import { Node, mergeAttributes } from '@tiptap/core'

const CHIP_STYLE =
  'background:#dbeafe;color:#1d4ed8;border-radius:4px;' +
  'padding:2px 8px;font-size:0.8em;font-weight:600;' +
  'display:inline-block;user-select:none;white-space:nowrap;'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variableChip: {
      /** Insert a variable chip at the current cursor position */
      insertVariableChip: (name: string) => ReturnType
    }
  }
}

export const VariableChipExtension = Node.create({
  name: 'variableChip',
  inline: true,
  group: 'inline',
  atom: true,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute('data-variable'),
        renderHTML: (attrs) => ({ 'data-variable': attrs.name }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-variable]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { style: CHIP_STYLE }),
      node.attrs.name as string,
    ]
  },

  addCommands() {
    return {
      insertVariableChip:
        (name: string) =>
        ({ chain }) =>
          chain()
            .insertContent({ type: this.name, attrs: { name } })
            .run(),
    }
  },
})
