import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './app-router'
import './index.css'
import './styles/globals.css'

export async function bootstrapClient() {
  if (window.__LIOX_BOOTSTRAP_PROMISE__) {
    await window.__LIOX_BOOTSTRAP_PROMISE__
  }

  ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  )
}
