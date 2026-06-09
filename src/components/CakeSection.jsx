import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// High-quality, realistic cake images from Unsplash (free, no auth needed)
const CAKES = [
  {
    flavor: 'Chocolate',
    emoji: '🍫',
    description: 'Rich dark chocolate layers with velvety ganache frosting',
    color: '#5C3317',
    gradient: 'linear-gradient(135deg, #3d1a00, #7b3f00)',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=85&fit=crop',
    tag: 'Most Loved'
  },
  {
    flavor: 'Black Forest',
    emoji: '🍒',
    description: 'Moist chocolate sponge with cherries & whipped cream',
    color: '#1a0a1e',
    gradient: 'linear-gradient(135deg, #1a0a1e, #4a1942)',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=85&fit=crop',
    tag: 'Classic'
  },
  {
    flavor: 'Red Velvet',
    emoji: '❤️',
    description: 'Velvety red layers with tangy cream cheese frosting',
    color: '#8B0000',
    gradient: 'linear-gradient(135deg, #8B0000, #c0392b)',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=85&fit=crop',
    tag: 'Romantic'
  },
  {
    flavor: 'Butterscotch',
    emoji: '🧈',
    description: 'Soft sponge with butterscotch sauce & caramel drizzle',
    color: '#8B6914',
    gradient: 'linear-gradient(135deg, #8B6914, #d4a017)',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=85&fit=crop',
    tag: 'Sweet'
  },
  {
    flavor: 'Pineapple',
    emoji: '🍍',
    description: 'Light vanilla sponge with fresh pineapple & chantilly cream',
    color: '#228B22',
    gradient: 'linear-gradient(135deg, #1a5c1a, #f39c12)',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=85&fit=crop',
    tag: 'Tropical'
  },
  {
    flavor: 'Strawberry',
    emoji: '🍓',
    description: 'Fluffy vanilla cake with strawberry jam & fresh strawberries',
    color: '#C41E3A',
    gradient: 'linear-gradient(135deg, #c41e3a, #ff6b8a)',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=85&fit=crop',
    tag: 'Fresh'
  }
]

// Fallback image for broken loads
const FALLBACK_IMAGES = {
  'Chocolate': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=85&fit=crop',
  'Black Forest': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=85&fit=crop',
  'Red Velvet': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=85&fit=crop',
  'Butterscotch': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=85&fit=crop',
  'Pineapple': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=85&fit=crop',
  'Strawberry': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=85&fit=crop'
}

function CakeCard({ cake, isSelected, onClick }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      layout
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`cake-card ${isSelected ? 'cake-card--selected' : ''}`}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Select ${cake.flavor} cake`}
    >
      {/* Tag */}
      <div className="cake-tag" style={{ background: cake.gradient }}>
        {cake.tag}
      </div>

      {/* Image */}
      <div className="cake-img-wrapper">
        <img
          src={imgError ? (FALLBACK_IMAGES[cake.flavor] || FALLBACK_IMAGES['Chocolate']) : cake.image}
          alt={`${cake.flavor} cake`}
          className="cake-img"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        <div className="cake-img-overlay" style={{ background: cake.gradient.replace('135deg', '180deg') }} />
      </div>

      {/* Info */}
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

export default function CakeSection() {
  const [selectedFlavor, setSelectedFlavor] = useState('Red Velvet')
  const [form, setForm] = useState({ name: '', address: '', message: '' })
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const selectedCake = CAKES.find(c => c.flavor === selectedFlavor) || CAKES[0]

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.address.trim()) {
      setStatus('Please provide your name and address.')
      return
    }
    setSubmitting(true)
    setStatus('')
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api/cake-order'
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ flavor: selectedFlavor, ...form })
      })
      if (res.ok) {
        setStatus('🎂 Your birthday surprise is being prepared! ❤️')
        setSubmitted(true)
        setSubmitting(false)
        return
      }
    } catch { /* fallback */ }

    // localStorage fallback
    const orders = JSON.parse(localStorage.getItem('cakeOrders') || '[]')
    orders.push({ flavor: selectedFlavor, ...form, date: new Date().toISOString() })
    localStorage.setItem('cakeOrders', JSON.stringify(orders))
    setStatus('🎂 Your birthday surprise is being prepared! ❤️')
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <section className="cake-section">
      <div className="section-header">
        <h3 className="section-title">🎂 Birthday Cake</h3>
        <p className="section-subtitle">Choose Khushi's special birthday cake</p>
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

      {/* Order Form */}
      <AnimatePresence>
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
              onError={e => { e.currentTarget.src = FALLBACK_IMAGES[selectedCake.flavor] || FALLBACK_IMAGES['Chocolate'] }}
            />
            <div className="cake-order-info">
              <div style={{ fontSize: '2.5rem' }}>{selectedCake.emoji}</div>
              <h4 style={{ margin: '0.5rem 0', color: '#601035', fontFamily: "'Playfair Display', serif" }}>
                {selectedCake.flavor} Cake
              </h4>
              <p style={{ color: '#6a1130', fontSize: '0.9rem' }}>{selectedCake.description}</p>
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="cake-form" aria-label="Cake order form">
              <h4 style={{ marginBottom: '1rem', color: '#601035' }}>Send This Cake 🎁</h4>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  placeholder="Enter your name"
                  required
                  aria-label="Recipient name"
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
                  aria-label="Delivery address"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Birthday Message 💌</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="form-input form-textarea"
                  placeholder="Write a heartfelt message..."
                  rows={3}
                  aria-label="Birthday message"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="cake-submit-btn"
                style={{ background: selectedCake.gradient }}
              >
                {submitting ? '💌 Sending...' : '🎂 Order Surprise Cake'}
              </button>
              {status && <div className="form-status">{status}</div>}
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="cake-success"
            >
              <div style={{ fontSize: '3rem' }}>🎉</div>
              <h4 style={{ color: '#601035', margin: '0.5rem 0' }}>Order Placed!</h4>
              <p style={{ color: '#6a1130' }}>{status}</p>
              <button
                onClick={() => { setSubmitted(false); setStatus(''); setForm({ name: '', address: '', message: '' }) }}
                className="cake-submit-btn"
                style={{ background: selectedCake.gradient, marginTop: '1rem' }}
              >
                Order Another
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
