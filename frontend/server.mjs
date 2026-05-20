import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import compression from 'compression'
import sirv from 'sirv'
import { fileURLToPath } from 'node:url'
import { preloadRouteData } from './src/ssr/routeData.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 8080)
const base = '/'

async function createServer() {
  const app = express()
  app.use(compression())

  let vite
  let render
  let template

  if (!isProd) {
    const { createServer } = await import('vite')
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    })
    app.use(vite.middlewares)
  } else {
    app.use(base, sirv(path.resolve(__dirname, 'dist/client'), { extensions: [] }))
    template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8')
    render = (await import('./dist/server/entry-server.js')).render
  }

  app.use(async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, '')

      let htmlTemplate
      let ssrRender

      if (!isProd) {
        htmlTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        htmlTemplate = await vite.transformIndexHtml(url, htmlTemplate)
        ssrRender = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        htmlTemplate = template
        ssrRender = render
      }

      const routeData = await preloadRouteData(url)
      const rendered = await ssrRender(url)
      const routeDataObject = Object.fromEntries(routeData.map((item) => [item.key, item.data]))
      const appDataScript = `<script>window.__LIOX_ROUTE_DATA__ = ${JSON.stringify(routeDataObject).replace(/</g, '\\u003c')};$${''}</script>`.replace('$', '')
      const html = htmlTemplate
        .replace('<!--app-head-->', rendered.head || '')
        .replace('<!--app-data-->', appDataScript)
        .replace('<!--app-html-->', rendered.html)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite?.ssrFixStacktrace?.(e)
      console.error(e)
      res.status(500).end(e?.stack || String(e))
    }
  })

  app.listen(port, () => {
    console.log(`SSR server running on http://localhost:${port}`)
  })
}

createServer()
