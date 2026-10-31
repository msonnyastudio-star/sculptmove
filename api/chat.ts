// Fonction serveur Vercel de l'assistante Kimi. Les clés d'IA ne quittent jamais le serveur.
import { handleChat } from '../server/assistant/handler.js'

export async function POST(request: Request) {
  return handleChat(request)
}
