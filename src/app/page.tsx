'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Logo from '@/components/Logo'
import PromoBanner from '@/components/PromoBanner'
import Testimonials from '@/components/Testimonials'

export default function Home() {
  const [categories, setCategories] = useState<any[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [addedProduct, setAddedProduct] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
    const saved = JSON.parse(localStorage.getItem('everlasting-cart') || '[]')
    const existing = saved.find((item: any) => item.id === product.id)
    let updated
    if (existing) {
      updated = saved.map((item: any) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    } else {
      updated = [...saved, { ...product, quantity: 1 }]
    }
    setCart(updated)
    localStorage.setItem('everlasting-cart', JSON.stringify(updated))
    setAddedProduct(product.id)
    setTimeout(() => setAddedProduct(null), 2000)
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

      <PromoBanner />

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
          <div className="flex-1 max-w-sm hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchQuery && (window.location.href = `/search?q=${searchQuery}`)}
                className="w-full px-4 py-2 rounded-full outline-none text-sm"
                style={{background: 'rgba(135,206,235,0.1)', border: '1px solid rgba(135,206,235,0.3)', color: '#2c2c2c'}}
              />
              <Link href={`/search?q=${searchQuery}`}>
                <span className="absolute right-3 top-2" style={{color: '#1E90FF', cursor: 'pointer'}}>🔍</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/search" className="text-sm font-medium hidden sm:block" style={{color: '#1E90FF'}}>Search</Link>
            <Link href="/shop" className="text-sm font-medium hidden sm:block" style={{color: '#1E90FF'}}>Shop</Link>
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
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{color: 'rgba(44,44,44,0.6)'}}>
            Premium perfumes, abayas, jalabiya, slides and fashion — crafted for those who appreciate the finest things.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search for perfumes, abayas, slides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/search?q=${searchQuery}`)}
                className="flex-1 px-5 py-3 rounded-full outline-none text-sm"
                style={{background: 'white', border: '2px solid rgba(135,206,235,0.4)', color: '#2c2c2c', boxShadow: '0 4px 20px rgba(135,206,235,0.15)'}}
              />
              <Link href={`/search?q=${searchQuery}`} className="px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105 sky-btn">
                🔍
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="px-10 py-4 rounded-full font-black text-lg text-white transition-all hover:scale-105 sky-btn">
              Shop Now →
            </Link>
            <Link href="/shop?category=perfumes" className="px-10 py-4 rounded-full font-black text-lg transition-all hover:scale-105" style={{background: 'white', border: '2px solid #87CEEB', color: '#1E90FF'}}>
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
              const isAdded = addedProduct === product.id
              return (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden" style={{border: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
                  <Link href={`/product/${product.id}`}>
                    <div className="relative" style={{background: '#f9f9f9', height: '180px'}}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
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
                  </Link>
                  <div className="p-3">
                    <Link href={`/product/${product.id}`}>
                      <p className="text-xs mb-2 line-clamp-2 hover:text-blue-500 transition-colors" style={{color: '#2c2c2c', minHeight: '32px'}}>
                        {product.name}
                      </p>
                    </Link>
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
                      style={{background: isAdded ? 'linear-gradient(135deg, #34d399, #059669)' : undefined}}
                    >
                      {isAdded ? '✅ Added!' : '🛒 Add to Cart'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="text-center mt-8">
          <Link href="/shop" className="px-10 py-4 rounded-full font-black text-white transition-all hover:scale-105 inline-block sky-btn">
            View All Products →
          </Link>
        </div>
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{background: 'white', borderTop: '1px solid #e0e0e0', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'}}>
          <Link href="/cart" className="flex items-center justify-between px-6 py-3 rounded-full font-black text-white w-full transition-all hover:scale-105 sky-btn">
            <span>🛒 {cartCount} items</span>
            <span>₦{cartTotal.toLocaleString()} → Order via WhatsApp</span>
          </Link>
        </div>
      )}

      <Testimonials />

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
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col sm:flex-row justify-between items-center gap-8 mb-8 pb-8" style={{borderBottom: '1px solid rgba(135,206,235,0.2)'}}>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <Logo size={40} />
                <div>
                  <h2 className="text-xl font-black sky-text">EVERLASTING</h2>
                  <p className="text-xs tracking-widest" style={{color: 'rgba(30,144,255,0.5)'}}>STORE</p>
                </div>
              </div>
              <p className="text-xs max-w-xs" style={{color: 'rgba(44,44,44,0.5)'}}>
                Premium perfumes, abayas, jalabiya, slides and fashion. Delivered across Nigeria.
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color: '#1E90FF'}}>Follow Us</p>
              <div className="flex items-center gap-3 justify-center">
                <a
                  href="https://instagram.com/everlasting_store075"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110"
                  style={{background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'}}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@everlasting_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110"
                  style={{background: '#000000'}}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/>
                  </svg>
                </a>
                <a
                  href="https://wa.me/2347041304966"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110"
                  style={{background: 'linear-gradient(135deg, #25d366, #128c7e)'}}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
              <div className="mt-2 text-xs space-y-1" style={{color: 'rgba(44,44,44,0.4)'}}>
                <p>📸 @everlasting_store075</p>
                <p>🎵 @everlasting_store</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm mb-6">
            {[
              {href: '/shop', label: 'Shop'},
              {href: '/search', label: '🔍 Search'},
              {href: '/cart', label: 'Cart'},
              {href: '/about', label: 'About Us'},
              {href: '/faq', label: 'FAQ'},
              {href: '/size-guide', label: 'Size Guide'},
              {href: '/admin', label: 'Admin'},
            ].map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-blue-500 transition" style={{color: 'rgba(30,144,255,0.6)'}}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="text-center">
            <div className="flex justify-center gap-4 text-xs mb-3">
              <Link href="/privacy" style={{color: 'rgba(30,144,255,0.6)'}}>Privacy Policy</Link>
              <Link href="/terms" style={{color: 'rgba(30,144,255,0.6)'}}>Terms & Conditions</Link>
            </div>
            <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
    }
