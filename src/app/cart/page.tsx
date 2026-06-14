'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { supabase } from '@/lib/supabase'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponMsg, setCouponMsg] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('everlasting-cart') || '[]')
    setCart(saved)
    prefillFromAccount()
  }, [])

  const prefillFromAccount = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        setName(profile.full_name || '')
        setPhone(profile.phone || '')
      }
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setApplyingCoupon(true)
    setCouponMsg('')
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single()

    if (!coupon) {
      setCouponMsg('❌ Invalid or expired coupon code!')
      setApplyingCoupon(false)
      return
    }

    if (coupon.used_count >= coupon.max_uses) {
      setCouponMsg('❌ This coupon has reached its maximum uses!')
      setApplyingCoupon(false)
      return
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      setCouponMsg('❌ This coupon has expired!')
      setApplyingCoupon(false)
      return
    }

    if (total < coupon.min_order) {
      setCouponMsg(`❌ Minimum order of ₦${coupon.min_order.toLocaleString()} required for this coupon!`)
      setApplyingCoupon(false)
      return
    }

    setAppliedCoupon(coupon)
    setCouponMsg(`✅ Coupon applied! You save ₦${getDiscount(coupon).toLocaleString()}`)
    setApplyingCoupon(false)
  }

  const getDiscount = (coupon: any) => {
    if (!coupon) return 0
    if (coupon.type === 'fixed') return coupon.value
    if (coupon.type === 'percentage') return Math.round(total * coupon.value / 100)
    return 0
  }

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
  const discount = getDiscount(appliedCoupon)
  const finalTotal = Math.max(0, total - discount)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const getItemDiscount = (price: number, comparePrice: number) => {
    if (!comparePrice || comparePrice <= price) return null
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) return
    if (!name.trim()) { alert('Please enter your full name!'); return }
    if (!phone.trim()) { alert('Please enter your phone number!'); return }
    if (!address.trim()) { alert('Please enter your delivery address!'); return }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2347041304966'

    let message = '🛍️ *NEW ORDER - Everlasting Store*\n'
    message += '━━━━━━━━━━━━━━━━━━━━\n\n'
    message += '👤 *Customer Details:*\n'
    message += `   Name: ${name}\n`
    message += `   Phone: ${phone}\n`
    message += `   Address: ${address}\n\n`
    message += '🛒 *Items Ordered:*\n'

    cart.forEach((item, index) => {
      message += `\n${index + 1}. *${item.name}*\n`
      message += `   Qty: ${item.quantity}\n`
      message += `   Price: ₦${item.price.toLocaleString()} x ${item.quantity}\n`
      message += `   Subtotal: ₦${(item.price * item.quantity).toLocaleString()}\n`
      if (item.image_url) message += `   Photo: ${item.image_url}\n`
    })

    message += '\n━━━━━━━━━━━━━━━━━━━━\n'
    message += `🧾 Subtotal: ₦${total.toLocaleString()}\n`

    if (appliedCoupon) {
      message += `🎟️ Coupon (${appliedCoupon.code}): -₦${discount.toLocaleString()}\n`
      await supabase.from('coupons').update({ used_count: appliedCoupon.used_count + 1 }).eq('id', appliedCoupon.id)
    }

    message += `💰 *TOTAL: ₦${finalTotal.toLocaleString()}*\n`
    message += '━━━━━━━━━━━━━━━━━━━━\n\n'
    message += '⏳ _Waiting for payment details..._'

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  const inputStyle = {
    background: '#ffffff',
    border: '1px solid rgba(135,206,235,0.5)',
    color: '#2c2c2c',
    borderRadius: '12px',
    padding: '12px 16px',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
  }

  return (
    <div className="min-h-screen" style={{background: '#fdf8f0'}}>

      <nav style={{background: '#ffffff', borderBottom: '1px solid rgba(135,206,235,0.4)', boxShadow: '0 2px 20px rgba(135,206,235,0.15)'}} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Logo size={36} />
              <div>
                <h1 className="text-lg font-black tracking-wider sky-text leading-tight">EVERLASTING</h1>
                <p className="text-xs tracking-widest leading-tight" style={{color: 'rgba(30,144,255,0.6)'}}>STORE</p>
              </div>
            </div>
          </Link>
          <Link href="/shop" className="text-sm font-medium" style={{color: '#1E90FF'}}>← Continue Shopping</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color: '#1E90FF'}}>Your Selection</p>
          <h1 className="text-3xl font-black" style={{color: '#2c2c2c'}}>
            Shopping Cart
            <span className="text-lg font-normal ml-3" style={{color: 'rgba(44,44,44,0.4)'}}>({cartCount} items)</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-7xl mb-6">🛒</p>
            <p className="text-2xl font-black mb-2" style={{color: '#2c2c2c'}}>Your cart is empty</p>
            <p className="mb-8" style={{color: 'rgba(44,44,44,0.5)'}}>Add some beautiful products!</p>
            <Link href="/shop" className="px-10 py-4 rounded-full font-black text-white transition-all hover:scale-105 inline-block sky-btn">Shop Now →</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* Cart Items */}
            <div className="space-y-4">
              {cart.map((item) => {
                const itemDiscount = getItemDiscount(item.price, item.compare_price)
                return (
                  <div key={item.id} className="card p-4 flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0" style={{background: 'rgba(135,206,235,0.1)'}}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><span className="text-3xl">✨</span></div>
                      )}
                      {itemDiscount && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-black text-white" style={{background: '#ff4444'}}>-{itemDiscount}%</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2" style={{color: '#2c2c2c'}}>{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="sky-text font-black text-base">₦{item.price.toLocaleString()}</p>
                        {item.compare_price && <p className="text-xs line-through" style={{color: 'rgba(44,44,44,0.4)'}}>₦{item.compare_price.toLocaleString()}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full font-bold flex items-center justify-center" style={{background: 'rgba(135,206,235,0.2)', border: '1px solid rgba(135,206,235,0.4)', color: '#1E90FF'}}>-</button>
                      <span className="w-8 text-center font-bold" style={{color: '#2c2c2c'}}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full font-bold flex items-center justify-center" style={{background: 'rgba(135,206,235,0.2)', border: '1px solid rgba(135,206,235,0.4)', color: '#1E90FF'}}>+</button>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black sky-text">₦{(item.price * item.quantity).toLocaleString()}</p>
                      <button onClick={() => removeItem(item.id)} className="text-xs mt-1 text-red-400 hover:text-red-500 transition">Remove</button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Delivery Details */}
            <div className="card p-6">
              <h2 className="text-lg font-black mb-5" style={{color: '#2c2c2c'}}>📦 Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Full Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Abdulhakeem Khalid" style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Phone Number *</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 08012345678" style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Full Delivery Address *</label>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. No 20 Animashaun Street, Mapo, Ibadan, Oyo State" rows={3} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Order Summary with Coupon */}
            <div className="card p-6">
              <h2 className="text-lg font-black mb-5" style={{color: '#2c2c2c'}}>Order Summary</h2>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span style={{color: 'rgba(44,44,44,0.5)'}}>{item.name} x{item.quantity}</span>
                    <span className="font-bold" style={{color: '#2c2c2c'}}>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-4 p-4 rounded-xl" style={{background: 'rgba(135,206,235,0.08)', border: '1px solid rgba(135,206,235,0.2)'}}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{color: '#1E90FF'}}>🎟️ Coupon Code</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponMsg('') }}
                    placeholder="Enter coupon code e.g WELCOME500"
                    className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                    style={{background: 'white', border: '1px solid rgba(135,206,235,0.4)', color: '#2c2c2c'}}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={applyingCoupon}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:scale-105 sky-btn disabled:opacity-40"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponMsg && (
                  <p className="text-xs mt-2 font-bold" style={{color: appliedCoupon ? '#34d399' : '#f87171'}}>{couponMsg}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs font-bold" style={{color: '#34d399'}}>✅ {appliedCoupon.code} applied!</p>
                    <button onClick={() => { setAppliedCoupon(null); setCouponMsg(''); setCouponCode('') }} className="text-xs text-red-400">Remove</button>
                  </div>
                )}
                <p className="text-xs mt-2" style={{color: 'rgba(44,44,44,0.4)'}}>
                  Try: WELCOME500, NEWUSER10, EVERLASTING, SAVE5
                </p>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4 pt-2" style={{borderTop: '1px solid rgba(135,206,235,0.2)'}}>
                <div className="flex justify-between text-sm">
                  <span style={{color: 'rgba(44,44,44,0.5)'}}>Subtotal</span>
                  <span className="font-bold" style={{color: '#2c2c2c'}}>₦{total.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span style={{color: '#34d399'}}>Discount ({appliedCoupon.code})</span>
                    <span className="font-bold" style={{color: '#34d399'}}>-₦{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-xl pt-2" style={{borderTop: '1px solid rgba(135,206,235,0.15)'}}>
                  <span style={{color: '#2c2c2c'}}>Total</span>
                  <span className="sky-text">₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="rounded-xl p-4 mb-4" style={{background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)'}}>
                <p className="text-sm font-bold mb-1" style={{color: '#25d366'}}>📱 Order via WhatsApp</p>
                <p className="text-xs" style={{color: 'rgba(44,44,44,0.5)'}}>
                  Fill in your details above then click the button. Your order with product images will be sent to our WhatsApp!
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
                Send Order to WhatsApp
              </button>

              <button onClick={clearCart} className="w-full mt-3 text-xs text-red-400 hover:text-red-500 transition">
                Clear Cart
              </button>
            </div>

          </div>
        )}
      </div>

      <footer style={{background: '#ffffff', borderTop: '1px solid rgba(135,206,235,0.3)'}} className="py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-3"><Logo size={40} /></div>
          <h2 className="text-2xl font-black mb-1 sky-text">EVERLASTING STORE</h2>
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
                                          }
