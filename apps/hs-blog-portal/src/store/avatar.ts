import { create } from 'zustand'

interface AvatarStore {
  isHome: boolean
  setIsHome: (isHome: boolean) => void
}

export const useAvatarStore = create<AvatarStore>((set) => ({
  isHome: true,
  setIsHome: (isHome) => set({ isHome })
}))