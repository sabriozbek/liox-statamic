import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { resetSsrSeoState, renderSsrSeoTags } from './components/seo/ssrMeta'

export interface RenderResult {
  html: string
  head: string
}

export async function render(url: string): Promise<RenderResult> {
  resetSsrSeoState()

  const html = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  )

  return {
    html,
    head: renderSsrSeoTags(),
  }
}
