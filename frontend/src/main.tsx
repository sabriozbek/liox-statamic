import { bootstrapClient } from './entry-client'
import '@fortawesome/fontawesome-free/css/all.min.css'

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason)
})

bootstrapClient()
