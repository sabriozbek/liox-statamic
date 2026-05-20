import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import compression from 'compression'
import sirv from 'sirv'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 8080)
const base = '/'

async function createServer() {
  const app = express()
  app.use(compression())

  let vite: any
  let render: (url: string) => Promise<{ html: string }>
  let template: string

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
    // @ts-expect-error built at runtime
    render = (await import('./dist/server/entry-server.js')).render
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, '')

      let htmlTemplate: string
      let ssrRender: (url: string) => Promise<{ html: string }>

      if (!isProd) {
        htmlTemplate = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        htmlTemplate = await vite.transformIndexHtml(url, htmlTemplate)
        ssrRender = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        htmlTemplate = template
        ssrRender = render
      }

      const rendered = await ssrRender(url)
      const html = htmlTemplate.replace('<!--app-html-->', rendered.html)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e: any) {
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
