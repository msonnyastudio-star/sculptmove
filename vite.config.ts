import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// En développement, sert /api/chat avec la même fonction que sur Vercel et les clés de .env.local.
function assistantApi(): Plugin {
  return {
    name: 'assistant-api',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))
      server.middlewares.use('/api/chat', async (req, res) => {
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)
        const { POST } = await server.ssrLoadModule('/api/chat.ts')
        const headers = new Headers(Object.entries(req.headers).flatMap(([key, value]) => typeof value === 'string' ? [[key, value]] : []) as [string, string][])
        const response: Response = await POST(new Request(`http://${req.headers.host}/api/chat`, { method: req.method, headers, body: Buffer.concat(chunks) }))
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        res.end(await response.text())
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), assistantApi()],
  server: { watch: { ignored: ['**/videos/sculpt-move-accueil/**'] } },
  test: { include: ['tests/**/*.test.ts'] },
} as Parameters<typeof defineConfig>[0])
