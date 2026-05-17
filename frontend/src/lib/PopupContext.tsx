import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface PopupContextType {
  isOpen: boolean
  openPopup: () => void
  closePopup: () => void
}

const PopupContext = createContext<PopupContextType | undefined>(undefined)

export function PopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openPopup = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closePopup = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <PopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  )
}

export function usePopup() {
  const context = useContext(PopupContext)
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider')
  }
  return context
}

// Global popup trigger for components that need to open popup from outside
export const triggerBlogPopup = () => {
  window.dispatchEvent(new CustomEvent('open-demo-popup'))
}

export const listenForBlogPopup = (callback: () => void) => {
  const handler = () => callback()
  window.addEventListener('open-demo-popup', handler)
  return () => window.removeEventListener('open-demo-popup', handler)
}