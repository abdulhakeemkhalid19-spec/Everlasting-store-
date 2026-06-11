'use client'
import { useState, useEffect } from 'react'

const messages = [
  '🔥 LIMITED TIME OFFER — UP TO 30% OFF FOR FIRST 100 ORDERS!',
  '🌸 PREMIUM PERFUMES, ABAYAS, JALABIYA & MORE!',
  '🚚 ORDER VIA WHATSAPP — FAST DELIVERY ACROSS NIGERIA!',
  '✨ NEW ARRIVALS EVERY WEEK — SHOP NOW!',
]

export default function PromoBanner() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % messages.length)
        setVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <div
      className="w-full py-2.5 px-4 text-center text-xs font-bold tracking-wide"
      style={{
        background: 'linear-gradient(135deg, #1E90FF, #87CEEB)',
        color: 'white',
        letterSpacing: '0.05em',
      }}
    >
      {messages[current]}
    </div>
  )
}
