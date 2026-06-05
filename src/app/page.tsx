'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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

  return (
    <div className="min-h-screen" style={{background: '#0d0305'}}>

      {/* Navbar */}
      <nav style={{background: 'linear-gradient(180deg, #1a0508 0%, rgba(26,5,8,0.97) 100%)', borderBottom: '1px solid rgba(180,120,40,0.3)'}} className="sticky top-0 z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <div>
              <h1 className="text-2xl font-black tracking-wider gold-text">
                ✦ EVERLASTING
              </h1>
              <p className="text-xs tracking-widest" style={{color: 'rgba(246,211,101,0.6)'}}>STORE</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-sm font-medium hidden sm:block" style={{color: 'rgba(246,211,101,0.8)'}}>
              Shop
            </Link>
            <Link href="/cart" className="relative">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{background: 'rgba(180,120,40,0.2)', border: '1px solid rgba(180,120,40,0.4)'}}>
                <span className="text-lg">🛒</span>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center" style={{background: 'linear-gradient(135deg, #f6d365, #c8960c)', color: '#1a0508'}}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{background: 'linear-gradient(135deg, #0d0305 0%, #2d0a10 40%, #1a0810 100%)', minHeight: '90vh', display: 'flex', alignItems: 'center'}}>
        <div className="absolute top-10 left-10 w-80 h-80 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #6b1530, transparent)', filter: 'blur(60px)'}}></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-15" style={{background: 'radial-gradient(circle, #c8960c, transparent)', filter: 'blur(80px)'}}></div>

        <div className="max-w-6xl mx-auto px-4 py-20 text-center relative z-10 w-full">
          <div className="inline-block mb-6 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase" style={{background: 'rgba(180,120,40,0.15)', border: '1px solid rgba(180,120,40,0.4)', color: '#f6d365'}}>
            ✦ Premium Fashion & Perfumes
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight">
            <span className="text-white">Discover</span>
            <br />
            <span className="gold-text">Timeless Elegance</span>
          </h1>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{color: 'rgba(245,240,232,0.7)'}}>
            Premium perfumes, abayas, jalabiya, slides and fashion — crafted for those who appreciate the finest things.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-10 py-4 rounded-full font-black text-lg text-white transition-all hover:scale-105"
              style={{background: 'linear-gradient(135deg, #6b1530, #8b1a3b)', boxShadow: '0 8px 30px rgba(107,21,48,0.5)'}}
            >
              Shop Now →
            </Link>
            <Link
              href="/shop?category=perfumes"
              className="px-10 py-4 rounded-full font-black text-lg transition-all hover:scale-105"
              style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(180,120,40,0.4)', color: '#f6d365'}}
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
                <p className="text-2xl font-black gold-text">{stat.value}</p>
                <p className="text-xs" style={{color: 'rgba(245,240,232,0.5)'}}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{color: '#f6d365'}}>Browse</p>
          <h2 className="text-3xl font-black text-white">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="card p-5 text-center cursor-pointer group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {categoryIcons[cat.slug] || '✨'}
              </div>
              <p className="text-sm font-bold group-hover:text-yellow-300 transition-colors" style={{color: 'rgba(246,211,101,0.9)'}}>
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{color: '#f6d365'}}>Handpicked</p>
          <h2 className="text-3xl font-black text-white">New Arrivals</h2>
        </div>
        {featuredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">✨</p>
            <p className="text-lg" style={{color: 'rgba(245,240,232,0.5)'}}>Products coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card p-4 group">
                <div className="relative rounded-xl overflow-hidden mb-4" style={{background: 'rgba(107,21,48,0.2)', height: '180px'}}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">✨</span>
                    </div>
                  )}
                  {product.compare_price && (
                    <div className="absolute top-2 left-2 badge">SALE</div>
                  )}
                </div>
                <p className="text-xs mb-1" style={{color: 'rgba(246,211,101,0.6)'}}>{product.categories?.name}</p>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-snug" style={{color: 'rgba(245,240,232,0.9)'}}>
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="gold-text font-black text-base">₦{product.price.toLocaleString()}</span>
                  {product.compare_price && (
                    <span className="text-xs line-through" style={{color: 'rgba(245,240,232,0.3)'}}>
                      ₦{product.compare_price.toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2.5 rounded-xl text-sm font-black text-white transition-all hover:scale-105 burgundy-btn"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
          <Link
            href="/cart"
            className="flex items-center gap-4 px-8 py-4 rounded-full font-black text-white shadow-2xl transition-all hover:scale-105"
            style={{background: 'linear-gradient(135deg, #6b1530, #8b1a3b)', boxShadow: '0 8px 30px rgba(107,21,48,0.6)'}}
          >
            <span>🛒 {cartCount} items</span>
            <span style={{color: '#f6d365'}}>₦{cartTotal.toLocaleString()}</span>
            <span>→ Order via WhatsApp</span>
          </Link>
        </div>
      )}

      {/* Banner */}
      <div className="mx-4 mb-16 rounded-3xl overflow-hidden" style={{background: 'linear-gradient(135deg, #2d0a10, #1a0810)', border: '1px solid rgba(180,120,40,0.3)'}}>
        <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{color: '#f6d365'}}>Fast Delivery</p>
            <h3 className="text-2xl sm:text-4xl font-black text-white mb-2">Order via WhatsApp,</h3>
            <h3 className="text-2xl sm:text-4xl font-black gold-text">Delivered to You</h3>
          </div>
          <Link
            href="/shop"
            className="shrink-0 px-8 py-4 rounded-full font-black transition-all hover:scale-105 gold-btn"
          >
            Start Shopping →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{background: '#0a0205', borderTop: '1px solid rgba(180,120,40,0.2)'}} className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-1 gold-text">✦ EVERLASTING</h2>
          <p className="text-xs tracking-widest mb-4" style={{color: 'rgba(246,211,101,0.5)'}}>STORE</p>
          <p className="text-xs mb-6" style={{color: 'rgba(245,240,232,0.4)'}}>Premium Fashion & Perfumes</p>
          <div className="flex justify-center gap-8 text-sm mb-6">
            {[
              {href: '/shop', label: 'Shop'},
              {href: '/cart', label: 'Cart'},
              {href: '/admin', label: 'Admin'},
            ].map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-yellow-300 transition" style={{color: 'rgba(246,211,101,0.6)'}}>
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs" style={{color: 'rgba(245,240,232,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
