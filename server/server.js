const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
const https = require('https')

const dataDir = path.join(__dirname,'..','data')
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir,{recursive:true})
const ordersFile = path.join(dataDir,'orders.json')
if(!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, '[]')

app.post('/api/cake-order', async (req,res)=>{
  const order = req.body
  if(!order || Object.keys(order).length === 0){
    return res.status(400).json({ ok:false, error: 'empty_body', message: 'Request body is empty or invalid JSON' })
  }

  try{
    // Basic validation (name/flavor optional but helpful)
    const saved = {...order, receivedAt: new Date().toISOString()}
    const orders = JSON.parse(fs.readFileSync(ordersFile,'utf8')||'[]')
    orders.push(saved)
    fs.writeFileSync(ordersFile, JSON.stringify(orders,null,2))

    // Telegram notification if configured
    const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const TG_CHAT = process.env.TELEGRAM_CHAT_ID
    if (TG_TOKEN && TG_CHAT) {
      // Build message (handle client form fields: address, message; and fallback/other fields)
      const parts = [
        `Your birthday surprise is being prepared ❤️`,
        `Selected Cake: ${order.flavor || 'N/A'}`,
        `Name: ${order.name || 'N/A'}`
      ]
      if (order.address) parts.push(`Address: ${order.address}`)
      if (order.phone) parts.push(`Phone: ${order.phone}`)
      if (order.message) parts.push(`Birthday Message: ${order.message}`)
      if (order.notes) parts.push(`Notes: ${order.notes}`)
      if (order.time) parts.push(`Delivery Time: ${order.time}`)
      parts.push(`ReceivedAt: ${new Date().toISOString()}`)
      const message = parts.join('\n')
      const payload = JSON.stringify({ chat_id: TG_CHAT, text: message })
      const options = {
        hostname: 'api.telegram.org',
        path: `/bot${TG_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }

      // Wrap HTTPS request in a Promise so we can await the Telegram response
      const telegramResult = await new Promise((resolve, reject)=>{
        try{
          const r = https.request(options, (tgRes)=>{
            let data = ''
            tgRes.on('data', chunk => data += chunk)
            tgRes.on('end', ()=>{
              try{ const parsed = JSON.parse(data); resolve({ok:true, data: parsed}) } catch(e){ resolve({ok:true, data: data}) }
            })
          })
          r.on('error', (e)=> reject(e))
          r.write(payload)
          r.end()
        }catch(e){ reject(e) }
      }).catch(e=>({ok:false, error: String(e)}))

      // Log the telegram result for debugging
      console.log('Telegram notify result:', telegramResult)

      if(!telegramResult.ok){
        return res.status(502).json({ ok:false, error: 'telegram_error', detail: telegramResult })
      }
      return res.status(200).json({ ok:true, telegram: telegramResult.data })
    }

    // No telegram configured — still return success for order storage
    return res.status(200).json({ ok:true, warning: 'telegram_not_configured' })
  }catch(err){
    console.error('Failed to process order:', err)
    return res.status(500).json({ok:false, error:err.message})
  }
})

const port = parseInt(process.env.PORT || '4000', 10)

function startServer(p){
  const srv = app.listen(p, ()=> console.log('Demo cake server running on port', p))
  srv.on('error', (err)=>{
    if(err && err.code === 'EADDRINUSE'){
      console.error(`Port ${p} is already in use. Try stopping the process using that port or set a different PORT environment variable before starting the server.`)
      console.error('Example:')
      console.error('  npx kill-port', p)
      console.error('Or start with a different port:')
      console.error('  PORT=4001 node server/server.js')
      // exit gracefully
      process.exit(1)
    }
    console.error('Server error:', err)
    process.exit(1)
  })
  return srv
}

startServer(port)
