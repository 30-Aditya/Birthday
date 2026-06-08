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

app.post('/api/cake-order', (req,res)=>{
  const order = req.body
  try{
    const orders = JSON.parse(fs.readFileSync(ordersFile,'utf8')||'[]')
    orders.push({...order, receivedAt: new Date().toISOString()})
    fs.writeFileSync(ordersFile, JSON.stringify(orders,null,2))
    // If Telegram env vars are provided, send a notification message
    const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const TG_CHAT = process.env.TELEGRAM_CHAT_ID
    if (TG_TOKEN && TG_CHAT) {
      try {
        const message = `New cake order received:\nName: ${order.name || 'N/A'}\nPhone: ${order.phone || 'N/A'}\nFlavor: ${order.flavor || 'N/A'}\nNotes: ${order.notes || '-'}\nReceivedAt: ${new Date().toISOString()}`
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
        const reqTg = https.request(options, (tgRes) => {
          let data = ''
          tgRes.on('data', chunk => data += chunk)
          tgRes.on('end', () => {
            try { console.log('Telegram response:', JSON.parse(data)) } catch(e){ console.log('Telegram response (raw):', data) }
          })
        })
        reqTg.on('error', (e) => console.error('Telegram send error:', e.message))
        reqTg.write(payload)
        reqTg.end()
      } catch (err) {
        console.error('Failed to send Telegram notification', err)
      }
    }
    res.json({ok:true})
  }catch(err){
    console.error(err)
    res.status(500).json({ok:false, error:err.message})
  }
})

const port = process.env.PORT || 4000
app.listen(port, ()=> console.log('Demo cake server running on port', port))
