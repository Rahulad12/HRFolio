import { create } from 'zustand'
import type { ReactNode } from 'react'

interface ButtonState {
  text: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

interface ButtonStore {
  button: ButtonState
  setButtonState: (state: ButtonState) => void
}

export const useButtonStore = create<ButtonStore>((set) => ({
  button: { text: '', disabled: false, loading: false },
  setButtonState: (button) => set({ button }),
}))
