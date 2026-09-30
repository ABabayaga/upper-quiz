const webhookUrl = import.meta.env.VITE_SHEETS_WEBHOOK_URL

// Envia o cadastro para o Google Sheets via Apps Script (Web App).
// Fire-and-forget: falha aqui não pode travar o jogo.
export function sendToSheet(player: { name: string; instagram: string }) {
  if (!webhookUrl) return
  fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors', // Apps Script não responde com CORS; text/plain evita preflight
    body: JSON.stringify({ ...player, created_at: new Date().toISOString() }),
  }).catch(() => {})
}
