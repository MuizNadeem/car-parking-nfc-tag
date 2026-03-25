import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const applyThemeClass = (isDark: boolean): void => {
  document.documentElement.classList.toggle('dark', isDark)
}

applyThemeClass(darkMediaQuery.matches)
darkMediaQuery.addEventListener('change', (event) => applyThemeClass(event.matches))

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
