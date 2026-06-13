'use client'
import { useEffect, useState } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('everlasting-cookies')
    if (!accepted) {
      setTimeout(() => setVisible(true), 2000)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('everlasting-cookies', 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '16px',
        right: '16px',
        zIndex: 9999,
        maxWidth: '500px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '20px 24px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        border: '1px solid rgba(135,206,235,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
        <span style={{fontSize: '24px'}}>🍪</span>
        <div>
          <p style={{fontSize: '14px', fontWeight: '700', color: '#2c2c2c', marginBottom: '4px'}}>
            We use cookies
          </p>
          <p style={{fontSize: '12px', color: 'rgba(44,44,44,0.6)', lineHeight: '1.5'}}>
            We use cookies to improve your shopping experience on Everlasting Store. By continuing to browse, you agree to our use of cookies.
          </p>
        </div>
      </div>
      <div style={{display: 'flex', gap: '10px'}}>
        <button
          onClick={accept}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '50px',
            border: 'none',
            background: 'linear-gradient(135deg, #1E90FF, #87CEEB)',
            color: 'white',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          ✅ Accept All
        </button>
        <button
          onClick={accept}
          style={{
            padding: '10px 20px',
            borderRadius: '50px',
            border: '1px solid rgba(135,206,235,0.4)',
            background: 'transparent',
            color: '#1E90FF',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  )
}
