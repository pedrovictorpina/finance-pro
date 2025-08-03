// src/boot/dark-mode.ts
import { boot } from 'quasar/wrappers'
import { Dark } from 'quasar'

export default boot(() => {
  // Verificar se há preferência salva no localStorage
  const savedDarkMode = localStorage.getItem('darkMode')
  
  if (savedDarkMode !== null) {
    // Aplicar a preferência salva
    Dark.set(savedDarkMode === 'true')
  } else {
    // Se não há preferência salva, verificar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    Dark.set(prefersDark)
    localStorage.setItem('darkMode', prefersDark.toString())
  }
})