import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'

// ─── EmailJS Configuration ─────────────────────────────────────
// You MUST create a free account at https://www.emailjs.com and fill these in:
//   1. Add an Email Service (Gmail) → copy the Service ID
//   2. Create an Email Template with variables: {{cake}}, {{from_name}}, {{message}}, {{time}}
//      Set the template "To Email" to: aditya.30.rathaur@gmail.com
//      Set the Subject to: 🎂 New Birthday Cake Request
//   3. Copy your Public Key from Account → General
const EMAILJS_SERVICE_ID  = 'service_birthday'   // ← replace with your service ID
const EMAILJS_TEMPLATE_ID = 'template_birthday'  // ← replace with your template ID
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'     // ← replace with your public key

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
    flavor: 'Butterscotch',
    emoji: '🧈',
    description: 'Soft sponge with butterscotch sauce & caramel drizzle',
    gradient: 'linear-gradient(135deg, #8B6914, #d4a017)',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=85&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=600&q=85&fit=crop',
    tag: 'Sweet'
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
    flavor: 'Strawberry',
    emoji: '🍓',
    description: 'Fluffy vanilla cake with strawberry jam & fresh strawberries',
    gradient: 'linear-gradient(135deg, #c41e3a, #ff6b8a)',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=85&fit=crop',
    fallback: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=85&fit=crop',
    tag: 'Fresh'
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
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="popup-card"
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="popup-emoji">🎉</div>
            <h3 className="popup-title">Your Birthday Wish Has Been Sent!</h3>
            <p className="popup-subtitle">💖 Khushi will love it!</p>
            <div className="popup-sparkles">✨ 🎂 ✨</div>
            <motion.div
              className="popup-progress"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: 'linear' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Error Popup ───────────────────────────────────────────────
function ErrorPopup({ show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="popup-card popup-card--error"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="popup-emoji">❌</div>
            <h3 className="popup-title" style={{ color: '#8B0000' }}>Something went wrong.</h3>
            <p className="popup-subtitle">Please try again.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Main CakeSection ──────────────────────────────────────────
export default function CakeSection() {
  const [selectedFlavor, setSelectedFlavor] = useState('Red Velvet')
  const [form, setForm] = useState({ name: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  const selectedCake = CAKES.find(c => c.flavor === selectedFlavor) || CAKES[0]

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return

    setSubmitting(true)

    const now = new Date()
    const timeString = now.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata'
    })

    const templateParams = {
      cake: selectedFlavor,
      from_name: form.name.trim(),
      message: form.message.trim() || '(No message)',
      time: timeString,
      to_email: 'aditya.30.rathaur@gmail.com'
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )
      setShowSuccess(true)
      setForm({ name: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      // Fallback: save to localStorage so it's not lost
      const wishes = JSON.parse(localStorage.getItem('birthdayWishes') || '[]')
      wishes.push({ ...templateParams, date: now.toISOString() })
      localStorage.setItem('birthdayWishes', JSON.stringify(wishes))
      setShowError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="cake-section">
      <SuccessPopup show={showSuccess} onClose={() => setShowSuccess(false)} />
      <ErrorPopup show={showError} onClose={() => setShowError(false)} />

      <div className="section-header">
        <h3 className="section-title">🎂 Pick Your Birthday Cake</h3>
        <p className="section-subtitle">Choose the perfect cake for Khushi's special day</p>
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
          className="cake-order-card"
        >
          <div className="cake-order-preview">
            <img
              src={selectedCake.image}
              alt={selectedCake.flavor}
              className="cake-order-img"
              onError={e => { e.currentTarget.src = selectedCake.fallback }}
            />
            <div className="cake-order-info">
              <div style={{ fontSize: '2.5rem' }}>{selectedCake.emoji}</div>
              <h4 style={{ margin: '0.5rem 0', color: '#601035', fontFamily: "'Playfair Display', serif", fontSize: '1.4rem' }}>
                {selectedCake.flavor} Cake
              </h4>
              <p style={{ color: '#6a1130', fontSize: '0.9rem', lineHeight: 1.5 }}>{selectedCake.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="cake-form" aria-label="Birthday wish form">
            <h4 className="cake-form-title">🎂 Pick Your Birthday Cake</h4>

            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="form-input"
                placeholder="Enter your name"
                required
                aria-label="Your name"
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
                aria-label="Birthday message"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="cake-submit-btn"
              style={{ background: selectedCake.gradient }}
            >
              {submitting ? '💌 Sending...' : '🎁 Send My Birthday Wish'}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
