'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('everlasting-cart') || '[]')
    setCart(saved)
  }, [])

  const updateQuantity = (id: string, quantity: number) => {
    const updated = cart
      .map((item) => item.id === id ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0)
    localStorage.setItem('everlasting-cart', JSON.stringify(updated))
    setCart(updated)
  }

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id)
    localStorage.setItem('everlasting-cart', JSON.stringify(updated))
    setCart(updated)
  }

  const clearCart = () => {
    localStorage.setItem('everlasting-cart', '[]')
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2347041304966'

    let message = '🛍️ *New Order from Everlasting Store*\n\n'
    message += '*Items Ordered:*\n'

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `   Quantity: ${item.quantity}\n`
      message += `   Price: ₦${(item.price * item.quantity).toLocaleString()}\n\n`
    })

    message += `*Total: ₦${total.toLocaleString()}*\n\n`
    message += '📍 *Please send your delivery address*\n'
    message += '💳 *Payment details will be sent to you*'

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen" style={{background: '#0d0305'}}>

      {/* Navbar */}
      <nav style={{background: 'linear-gradient(180deg, #1a0508 0%, rgba(26,5,8,0.97) 100%)', borderBottom: '1px solid rgba(180,120,40,0.3)'}} className="sticky top-0 z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div>
              <h1 className="text-xl font-black tracking-wider gold-text">✦ EVERLASTING</h1>
              <p className="text-xs tracking-widest" style={{color: 'rgba(246,211,101,0.6)'}}>STORE</p>
            </div>
          </Link>
          <Link href="/shop" className="text-sm font-medium" style={{color: 'rgba(246,211,101,0.8)'}}>
            ← Continue Shopping
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color: '#f6d365'}}>Your Selection</p>
          <h1 className="text-3xl font-black text-white">
            Shopping Cart
            <span className="text-lg font-normal ml-3" style={{color: 'rgba(245,240,232,0.4)'}}>({cartCount} items)</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-7xl mb-6">🛒</p>
            <p className="text-2xl font-black text-white mb-2">Your cart is empty</p>
            <p className="mb-8" style={{color: 'rgba(245,240,232,0.5)'}}>Add some beautiful products!</p>
            <Link
              href="/shop"
              className="px-10 py-4 rounded-full font-black text-white transition-all hover:scale-105 inline-block burgundy-btn"
            >
              Shop Now →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="card p-4 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{background: 'rgba(107,21,48,0.2)'}}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl">✨</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2" style={{color: 'rgba(245,240,232,0.9)'}}>
                      {item.name}
                    </h3>
                    <p className="gold-text font-black text-base mt-1">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full font-bold text-white flex items-center justify-center transition hover:scale-110"
                      style={{background: 'rgba(107,21,48,0.4)', border: '1px solid rgba(180,120,40,0.3)'}}
                    >-</button>
                    <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full font-bold text-white flex items-center justify-center transition hover:scale-110"
                      style={{background: 'rgba(107,21,48,0.4)', border: '1px solid rgba(180,120,40,0.3)'}}
                    >+</button>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black gold-text">₦{(item.price * item.quantity).toLocaleString()}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs mt-1 transition hover:text-red-300"
                      style={{color: 'rgba(245,240,232,0.3)'}}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card p-6">
              <h2 className="text-lg font-black text-white mb-5">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span style={{color: 'rgba(245,240,232,0.5)'}}>
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-bold" style={{color: 'rgba(245,240,232,0.8)'}}>
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-black text-xl" style={{borderColor: 'rgba(180,120,40,0.2)'}}>
                  <span className="text-white">Total</span>
                  <span className="gold-text">₦{total.toLocaleString()}</span>
                </div>
              </div>

              {/* WhatsApp Notice */}
              <div className="rounded-xl p-4 mb-4" style={{background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)'}}>
                <p className="text-sm font-bold mb-1" style={{color: '#25d366'}}>
                  📱 Order via WhatsApp
                </p>
                <p className="text-xs" style={{color: 'rgba(245,240,232,0.5)'}}>
                  Click the button below to send your order to WhatsApp. Include your delivery address and we will send you payment details!
                </p>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:scale-105 flex items-center justify-center gap-3"
                style={{background: 'linear-gradient(135deg, #25d366, #128c7e)', boxShadow: '0 8px 30px rgba(37,211,102,0.3)'}}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-3 text-xs transition"
                style={{color: 'rgba(245,240,232,0.3)'}}
              >
                Clear Cart
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{background: '#0a0205', borderTop: '1px solid rgba(180,120,40,0.2)'}} className="py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-1 gold-text">✦ EVERLASTING</h2>
          <p className="text-xs" style={{color: 'rgba(245,240,232,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
