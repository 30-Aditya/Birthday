// Vercel Serverless function to receive cake orders and notify via Telegram
export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  let order = req.body
  // some runtimes don't parse automatically
  if (!order || Object.keys(order).length === 0) {
    try { order = await new Promise(r => { let data=''; req.on('data',c=>data+=c); req.on('end',()=>r(JSON.parse(data||'{}'))); }) } catch(e){ order = {} }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chat = process.env.TELEGRAM_CHAT_ID

  // Build message
  const message = `Your birthday surprise is being prepared ❤️\nI know which cake she selected: ${order.flavor || 'N/A'}\nName: ${order.name || 'N/A'}\nPhone: ${order.phone || 'N/A'}\nNotes: ${order.notes || '-'}\nReceivedAt: ${new Date().toISOString()}`

  if (!token || !chat) {
    // If no token/chat configured, return success but note unconfigured
    res.status(200).json({ ok: true, warning: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured', message })
    return
  }

  try {
    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: message })
    })
    const data = await resp.json()
    if (!data || !data.ok) {
      res.status(500).json({ ok: false, error: 'telegram_failed', detail: data })
      return
    }
    res.status(200).json({ ok: true, telegram: data })
  } catch (err) {
    res.status(500).json({ ok: false, error: 'request_failed', detail: String(err) })
  }
}
