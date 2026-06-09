import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'

// ─── EmailJS Configuration ─────────────────────────────────────
// You can configure these environment variables in your build settings or local .env file.
// Or change these fallbacks if you want to hardcode them directly.
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_birthday'
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_birthday'
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'

// ─── Cake Data with High-Quality Images ────────────────────────
const CAKES = [
  {
    flavor: 'Chocolate',
    emoji: '🍫',
    description: 'Rich dark chocolate layers with velvety ganache frosting',
    gradient: 'linear-gradient(135deg, #3d1a00, #7b3f00)',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=85&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=85&fit=crop',
    tag: 'Most Loved'
  },
  {
    flavor: 'Black Forest',
    emoji: '🍒',
    description: 'Moist chocolate sponge with cherries & whipped cream',
    gradient: 'linear-gradient(135deg, #1a0a1e, #4a1942)',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=85&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=85&fit=crop',
    tag: 'Classic'
  },
  {
    flavor: 'Red Velvet',
    emoji: '❤️',
    description: 'Velvety red layers with tangy cream cheese frosting',
    gradient: 'linear-gradient(135deg, #8B0000, #c0392b)',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=85&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=85&fit=crop',
    tag: 'Romantic'
  },
  {
    flavor: 'Strawberry',
    emoji: '🍓',
    description: 'Fluffy vanilla cake with strawberry jam & fresh strawberries',
    gradient: 'linear-gradient(135deg, #c41e3a, #ff6b8a)',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=85&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=85&fit=crop',
    tag: 'Fresh'
  },
  {
    flavor: 'Pineapple',
    emoji: '🍍',
    description: 'Light vanilla sponge with fresh pineapple & chantilly cream',
    gradient: 'linear-gradient(135deg, #1a5c1a, #f39c12)',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=85&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=85&fit=crop',
    tag: 'Tropical'
  },
  {
    flavor: 'Butterscotch',
    emoji: '🧈',
    description: 'Soft sponge with butterscotch sauce & caramel drizzle',
    gradient: 'linear-gradient(135deg, #8B6914, #d4a017)',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=85&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=600&q=85&fit=crop',
    tag: 'Sweet'
  }
]

// ─── Cake Card ─────────────────────────────────────────────────
function CakeCard({ cake, isSelected, onClick }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      layout
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`cake-card ${isSelected ? 'cake-card--selected' : ''}`}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Select ${cake.flavor} cake`}
    >
      <div className="cake-tag" style={{ background: cake.gradient }}>
        {cake.tag}
      </div>

      <div className="cake-img-wrapper">
        <img
          src={imgError ? cake.fallback : cake.image}
          alt={`${cake.flavor} cake`}
          className="cake-img"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div className="cake-img-overlay" style={{ background: cake.gradient.replace('135deg', '180deg') }} />
      </div>

      <div className="cake-info">
        <div className="cake-emoji">{cake.emoji}</div>
        <h4 className="cake-name">{cake.flavor}</h4>
        <p className="cake-desc">{cake.description}</p>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="cake-selected-badge"
          >
            ✓ Selected
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Success Popup ─────────────────────────────────────────────
function SuccessPopup({ show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <div className="popup-overlay" onClick={onClose}>
          <motion.div
            className="popup-card"
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={e => e.stopPropagation()}
            role="alert"
          >
            <div className="popup-emoji">🎉</div>
            <h3 className="popup-title">🎉 Cake Request Sent Successfully! 💖</h3>
            <p className="popup-subtitle">Khushi will receive your sweet surprise!</p>
            <div className="popup-sparkles">✨ 🎂 ✨</div>
            <motion.div
              className="popup-progress"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ─── Error Popup ───────────────────────────────────────────────
function ErrorPopup({ show, onClose, errorDetails }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 7500)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <div className="popup-overlay" onClick={onClose}>
          <motion.div
            className="popup-card popup-card--error"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={e => e.stopPropagation()}
            role="alert"
          >
            <div className="popup-emoji">❌</div>
            <h3 className="popup-title" style={{ color: '#8B0000' }}>Request Failed</h3>
            <p className="popup-subtitle" style={{ fontSize: '0.95rem', color: '#6a1130', wordBreak: 'break-word', marginTop: '0.5rem', lineHeight: 1.4 }}>
              {errorDetails || 'Something went wrong. Please check your connection.'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#8a2c52', marginTop: '0.8rem', opacity: 0.8 }}>
              (Your request has been saved locally in this browser so it won't be lost)
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ─── Main CakeSection ──────────────────────────────────────────
export default function CakeSection() {
  const [selectedFlavor, setSelectedFlavor] = useState('Chocolate')
  const [form, setForm] = useState({ name: '', phone: '', address: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorDetails, setErrorDetails] = useState('')

  const selectedCake = CAKES.find(c => c.flavor === selectedFlavor) || CAKES[0]

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) return

    setSubmitting(true)

    const now = new Date()
    const timeString = now.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata'
    })

    // Multi-mapped parameters to support whatever variables exist on their EmailJS template:
    const templateParams = {
      // Lowercase/underscored variations
      cake: selectedFlavor,
      cake_flavor: selectedFlavor,
      cake_selection: selectedFlavor,
      
      name: form.name.trim(),
      from_name: form.name.trim(),
      fullname: form.name.trim(),
      
      phone: form.phone.trim(),
      phone_number: form.phone.trim(),
      
      address: form.address.trim(),
      delivery_address: form.address.trim(),
      
      message: form.message.trim() || '(No message)',
      birthday_message: form.message.trim() || '(No message)',
      
      time: timeString,
      timestamp: timeString,

      // Capitalized variations (Name, Phone, Address, Cake, Message, Timestamp)
      Cake: selectedFlavor,
      Name: form.name.trim(),
      Phone: form.phone.trim(),
      Address: form.address.trim(),
      Message: form.message.trim() || '(No message)',
      Timestamp: timeString,
      
      to_email: 'aditya.30.rathaur@gmail.com'
    }

    console.log('--- EmailJS Diagnostics ---');
    console.log('Service ID:', EMAILJS_SERVICE_ID);
    console.log('Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('Public Key:', EMAILJS_PUBLIC_KEY);
    console.log('Is Public Key Placeholder?:', (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || !EMAILJS_PUBLIC_KEY) ? 'YES' : 'NO');
    console.log('EmailJS Params Payload:', templateParams);

    const hasValidKey = EMAILJS_PUBLIC_KEY && 
                        EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && 
                        EMAILJS_PUBLIC_KEY.trim() !== '';

    const hasValidService = EMAILJS_SERVICE_ID && 
                            EMAILJS_SERVICE_ID.trim() !== '';

    const hasValidTemplate = EMAILJS_TEMPLATE_ID && 
                             EMAILJS_TEMPLATE_ID.trim() !== '';

    try {
      if (!hasValidKey || !hasValidService || !hasValidTemplate) {
        let missingReason = [];
        if (!hasValidKey) missingReason.push('Public Key is missing or set to placeholder ("YOUR_PUBLIC_KEY")');
        if (!hasValidService) missingReason.push('Service ID is missing');
        if (!hasValidTemplate) missingReason.push('Template ID is missing');
        
        throw new Error(`Invalid EmailJS configuration: ${missingReason.join(', ')}`);
      }

      console.log('Attempting to send email via EmailJS...');
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )
      console.log('EmailJS Success Response:', response)
      setShowSuccess(true)
      setForm({ name: '', phone: '', address: '', message: '' })
    } catch (err) {
      console.error('EmailJS failed. Error details:', err)
      const emailjsError = err && (err.text || err.message || (typeof err === 'string' ? err : JSON.stringify(err))) || 'Unknown EmailJS error'

      console.warn(`EmailJS failed with: "${emailjsError}". Attempting silent backup email delivery via FormSubmit...`)
      
      try {
        const formSubmitUrl = 'https://formsubmit.co/ajax/aditya.30.rathaur@gmail.com'
        const backupPayload = {
          Cake: selectedFlavor,
          Name: form.name.trim(),
          Phone: form.phone.trim(),
          Address: form.address.trim(),
          Message: form.message.trim() || '(No message)',
          Timestamp: timeString,
          _subject: `🎂 Birthday Cake Request from ${form.name.trim()}!`,
          _template: 'table'
        }

        console.log('FormSubmit endpoint URL:', formSubmitUrl)
        console.log('FormSubmit payload:', backupPayload)

        const response = await fetch(formSubmitUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(backupPayload)
        })

        const data = await response.json()
        console.log('FormSubmit API Response:', data)

        if (response.ok && (data.success === 'true' || data.success === true)) {
          console.log('FormSubmit delivery succeeded!')
          setShowSuccess(true)
          setForm({ name: '', phone: '', address: '', message: '' })
        } else {
          throw new Error(data.message || `HTTP status ${response.status}`)
        }
      } catch (backupErr) {
        console.error('Backup Email (FormSubmit) also failed:', backupErr)
        const backupErrorText = backupErr.message || (typeof backupErr === 'string' ? backupErr : JSON.stringify(backupErr))
        
        const combinedError = `1. EmailJS Error: "${emailjsError}"\n2. Backup (FormSubmit) Error: "${backupErrorText}"`
        setErrorDetails(combinedError)
        
        // Fallback: save to localStorage so it's not lost
        const wishes = JSON.parse(localStorage.getItem('birthdayWishes') || '[]')
        wishes.push({ ...templateParams, date: now.toISOString() })
        localStorage.setItem('birthdayWishes', JSON.stringify(wishes))
        setShowError(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="cake-section">
      <SuccessPopup show={showSuccess} onClose={() => setShowSuccess(false)} />
      <ErrorPopup show={showError} onClose={() => setShowError(false)} errorDetails={errorDetails} />

      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h3 className="section-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#501033' }}>
          🎂 Pick Your Birthday Cake
        </h3>
        <p className="section-subtitle" style={{ color: '#6a1130', opacity: 0.8 }}>
          Choose the perfect cake for Khushi's special day
        </p>
      </div>

      {/* Cake Grid */}
      <div className="cake-grid">
        {CAKES.map(cake => (
          <CakeCard
            key={cake.flavor}
            cake={cake}
            isSelected={selectedFlavor === cake.flavor}
            onClick={() => setSelectedFlavor(cake.flavor)}
          />
        ))}
      </div>

      {/* Wish Form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedFlavor}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="cake-order-card"
        >
          <div className="cake-order-preview">
            <img
              src={selectedCake.image}
              alt={selectedCake.flavor}
              className="cake-order-img"
              onError={e => { e.currentTarget.src = selectedCake.fallback }}
            />
            <div className="cake-order-info" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>{selectedCake.emoji}</div>
              <h4 style={{ margin: '0.5rem 0', color: '#601035', fontFamily: "'Playfair Display', serif", fontSize: '1.4rem' }}>
                {selectedCake.flavor} Cake
              </h4>
              <p style={{ color: '#6a1130', fontSize: '0.9rem', lineHeight: 1.5 }}>{selectedCake.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="cake-form" aria-label="Birthday cake form">
            <h4 className="cake-form-title" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#601035' }}>
              🎂 Cake Request Details
            </h4>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="form-input"
                placeholder="Enter your full name"
                required
                aria-label="Full Name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="form-input"
                placeholder="Enter phone number"
                required
                aria-label="Phone Number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <input
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="form-input"
                placeholder="Enter delivery address"
                required
                aria-label="Delivery Address"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Birthday Message 💌</label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="form-input form-textarea"
                placeholder="Write a heartfelt birthday message for Khushi..."
                rows={4}
                required
                aria-label="Birthday message"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="cake-submit-btn"
              style={{ background: selectedCake.gradient }}
            >
              {submitting ? '💌 Sending...' : '🎁 Send Cake Request'}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
