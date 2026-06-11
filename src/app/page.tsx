'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Logo from '@/components/Logo'
import Logo from '@/components/Logo'
import PromoBanner from '@/components/PromoBanner'
import Testimonials from '@/components/Testimonials'

export default function Home() {
  const [categories, setCategories] = useState<any[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    fetchCategories()
    fetchFeaturedProducts()
    const saved = JSON.parse(localStorage.getItem('everlasting-cart') || '[]')
    setCart(saved)
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    if (data) setCategories(data)
  }

  const fetchFeaturedProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_active', true)
      .limit(8)
    if (data) setFeaturedProducts(data)
  }

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id)
    let updated
    if (existing) {
      updated = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    } else {
      updated = [...cart, { ...product, quantity: 1 }]
    }
    setCart(updated)
    localStorage.setItem('everlasting-cart', JSON.stringify(updated))
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const categoryIcons: any = {
    'perfumes': '🌸',
    'abayas': '👘',
    'jalabiya': '👗',
    'slides': '👡',
    'ladies-fashion': '👗',
    'mens-fashion': '👔',
    'accessories': '💍',
    'kids-wear': '👶',
  }

  const getDiscount = (price: number, comparePrice: number) => {
    if (!comparePrice || comparePrice <= price) return null
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  return (
    <div className="min-h-screen" style={{background: '#fdf8f0'}}>

      {/* Navbar */}
      <nav style={{background: '#ffffff', borderBottom: '1px solid rgba(135,206,235,0.4)', boxShadow: '0 2px 20px rgba(135,206,235,0.15)'}} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Logo size={38} />
              <div>
                <h1 className="text-xl font-black tracking-wider sky-text leading-tight">EVERLASTING</h1>
                <p className="text-xs tracking-widest leading-tight" style={{color: 'rgba(30,144,255,0.6)'}}>STORE</p>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-sm font-medium hidden sm:block" style={{color: '#1E90FF'}}>
              Shop
            </Link>
            <Link href="/cart" className="relative">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{background: 'rgba(135,206,235,0.2)', border: '1px solid rgba(135,206,235,0.4)'}}>
                <span className="text-lg">🛒</span>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center" style={{background: '#1E90FF', color: 'white'}}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{background: 'linear-gradient(135deg, #fdf8f0 0%, #e8f4fd 50%, #fdf8f0 100%)', minHeight: '90vh', display: 'flex', alignItems: 'center'}}>
        <div className="absolute top-10 left-10 w-80 h-80 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #87CEEB, transparent)', filter: 'blur(60px)'}}></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-15" style={{background: 'radial-gradient(circle, #1E90FF, transparent)', filter: 'blur(80px)'}}></div>

        <div className="max-w-6xl mx-auto px-4 py-20 text-center relative z-10 w-full">
          <div className="flex justify-center mb-6">
            <Logo size={80} />
          </div>
          <div className="inline-block mb-4 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase" style={{background: 'rgba(135,206,235,0.2)', border: '1px solid rgba(135,206,235,0.4)', color: '#1E90FF'}}>
            ✦ Premium Fashion & Perfumes
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight">
            <span style={{color: '#2c2c2c'}}>Discover</span>
            <br />
            <span className="sky-text">Timeless Elegance</span>
          </h1>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{color: 'rgba(44,44,44,0.6)'}}>
            Premium perfumes, abayas, jalabiya, slides and fashion — crafted for those who appreciate the finest things.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="px-10 py-4 rounded-full font-black text-lg text-white transition-all hover:scale-105 sky-btn">
              Shop Now →
            </Link>
            <Link
              href="/shop?category=perfumes"
              className="px-10 py-4 rounded-full font-black text-lg transition-all hover:scale-105"
              style={{background: 'white', border: '2px solid #87CEEB', color: '#1E90FF'}}
            >
              View Perfumes 🌸
            </Link>
          </div>
          <div className="flex justify-center gap-10 mt-16">
            {[
              {value: '100+', label: 'Products'},
              {value: '8', label: 'Categories'},
              {value: '24/7', label: 'Support'},
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black sky-text">{stat.value}</p>
                <p className="text-xs" style={{color: 'rgba(44,44,44,0.5)'}}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{color: '#1E90FF'}}>Browse</p>
          <h2 className="text-3xl font-black" style={{color: '#2c2c2c'}}>Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="card p-5 text-center cursor-pointer group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {categoryIcons[cat.slug] || '✨'}
              </div>
              <p className="text-sm font-bold group-hover:text-blue-500 transition-colors" style={{color: '#1E90FF'}}>
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{color: '#1E90FF'}}>Handpicked</p>
          <h2 className="text-3xl font-black" style={{color: '#2c2c2c'}}>New Arrivals</h2>
        </div>
        {featuredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">✨</p>
            <p className="text-lg" style={{color: 'rgba(44,44,44,0.4)'}}>Products coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => {
              const discount = getDiscount(product.price, product.compare_price)
              return (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden" style={{border: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
                  <div className="relative" style={{background: '#f9f9f9', height: '180px'}}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">✨</span>
                      </div>
                    )}
                    {discount && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-black text-white" style={{background: '#ff4444'}}>
                        -{discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs mb-2 line-clamp-2" style={{color: '#2c2c2c', minHeight: '32px'}}>{product.name}</p>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-base" style={{color: '#1E90FF'}}>₦{product.price.toLocaleString()}</span>
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="text-xs line-through" style={{color: '#999'}}>₦{product.compare_price.toLocaleString()}</span>
                      )}
                    </div>
                    {discount && (
                      <p className="text-xs font-bold mb-2" style={{color: '#ff4444'}}>-{discount}% OFF</p>
                    )}
                    <p className="text-xs mb-3" style={{color: '#3aaa35'}}>✓ In Stock</p>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2.5 rounded font-bold text-sm text-white transition-all hover:scale-105 sky-btn"
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{background: 'white', borderTop: '1px solid #e0e0e0', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'}}>
          <Link
            href="/cart"
            className="flex items-center justify-between px-6 py-3 rounded-full font-black text-white w-full transition-all hover:scale-105 sky-btn"
          >
            <span>🛒 {cartCount} items</span>
            <span>₦{cartTotal.toLocaleString()} → Order via WhatsApp</span>
          </Link>
        </div>
      )}

      {/* Banner */}
      <div className="mx-4 mb-16 rounded-3xl overflow-hidden" style={{background: 'linear-gradient(135deg, #e8f4fd, #ffffff)', border: '1px solid rgba(135,206,235,0.4)'}}>
        <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{color: '#1E90FF'}}>Fast Delivery</p>
            <h3 className="text-2xl sm:text-4xl font-black mb-2" style={{color: '#2c2c2c'}}>Order via WhatsApp,</h3>
            <h3 className="text-2xl sm:text-4xl font-black sky-text">Delivered to You</h3>
          </div>
          <Link href="/shop" className="shrink-0 px-8 py-4 rounded-full font-black text-white transition-all hover:scale-105 sky-btn">
            Start Shopping →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{background: '#ffffff', borderTop: '1px solid rgba(135,206,235,0.3)'}} className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-3">
            <Logo size={50} />
          </div>
          <h2 className="text-3xl font-black mb-1 sky-text">EVERLASTING</h2>
          <p className="text-xs tracking-widest mb-4" style={{color: 'rgba(30,144,255,0.5)'}}>STORE</p>
          <p className="text-xs mb-6" style={{color: 'rgba(44,44,44,0.4)'}}>Premium Fashion & Perfumes</p>
          <div className="flex justify-center gap-8 text-sm mb-6">
            {[
              {href: '/shop', label: 'Shop'},
              {href: '/cart', label: 'Cart'},
              {href: '/admin', label: 'Admin'},
            ].map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-blue-500 transition" style={{color: 'rgba(30,144,255,0.6)'}}>
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
