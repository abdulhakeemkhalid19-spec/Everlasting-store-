'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ShopContent() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get('category') || ''
    setSelectedCategory(cat)
    fetchCategories()
    const saved = JSON.parse(localStorage.getItem('everlasting-cart') || '[]')
    setCart(saved)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchQuery])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    if (data) setCategories(data)
  }

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_active', true)

    if (selectedCategory) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', selectedCategory)
        .single()
      if (cat) query = query.eq('category_id', cat.id)
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }

    const { data } = await query
    if (data) setProducts(data)
    setLoading(false)
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
    localStorage.setItem('everlasting-cart', JSON.stringify(updated))
    setCart(updated)
    alert(`${product.name} added to cart!`)
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
              <h1 className="text-xl font-black tracking-wider gold-text">✦ EVERLASTING</h1>
              <p className="text-xs tracking-widest" style={{color: 'rgba(246,211,101,0.6)'}}>STORE</p>
            </div>
          </Link>
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full text-white outline-none text-sm"
                style={{background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(180,120,40,0.3)'}}
              />
              <span className="absolute right-3 top-2.5" style={{color: '#f6d365'}}>🔍</span>
            </div>
          </div>
          <Link href="/cart" className="relative shrink-0">
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
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">

        {/* Sidebar */}
        <div className="hidden sm:block w-52 shrink-0">
          <div className="card p-4 sticky top-24">
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{color: '#f6d365'}}>Categories</p>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={selectedCategory === ''
                  ? {background: 'linear-gradient(135deg, #6b1530, #8b1a3b)', color: 'white'}
                  : {color: 'rgba(245,240,232,0.6)'}
                }
              >
                ✨ All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={selectedCategory === cat.slug
                    ? {background: 'linear-gradient(135deg, #6b1530, #8b1a3b)', color: 'white'}
                    : {color: 'rgba(245,240,232,0.6)'}
                  }
                >
                  {categoryIcons[cat.slug] || '✨'} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white">
              {selectedCategory
                ? categories.find(c => c.slug === selectedCategory)?.name || 'Products'
                : 'All Products'}
            </h2>
            <span className="text-xs px-3 py-1 rounded-full" style={{background: 'rgba(255,255,255,0.05)', color: 'rgba(245,240,232,0.5)'}}>
              {products.length} items
            </span>
          </div>

          {/* Mobile Categories */}
          <div className="sm:hidden flex gap-2 overflow-x-auto pb-4 mb-4">
            <button
              onClick={() => setSelectedCategory('')}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold"
              style={selectedCategory === ''
                ? {background: 'linear-gradient(135deg, #6b1530, #8b1a3b)', color: 'white'}
                : {background: 'rgba(255,255,255,0.05)', color: 'rgba(245,240,232,0.6)', border: '1px solid rgba(180,120,40,0.2)'}
              }
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold"
                style={selectedCategory === cat.slug
                  ? {background: 'linear-gradient(135deg, #6b1530, #8b1a3b)', color: 'white'}
                  : {background: 'rgba(255,255,255,0.05)', color: 'rgba(245,240,232,0.6)', border: '1px solid rgba(180,120,40,0.2)'}
                }
              >
                {categoryIcons[cat.slug]} {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">✨</p>
              <p style={{color: 'rgba(245,240,232,0.5)'}}>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">✨</p>
              <p className="text-lg mb-6" style={{color: 'rgba(245,240,232,0.5)'}}>No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="card p-3 group">
                  <div className="relative rounded-xl overflow-hidden mb-3" style={{background: 'rgba(107,21,48,0.2)', height: '160px'}}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">✨</span>
                      </div>
                    )}
                    {product.compare_price && (
                      <div className="absolute top-2 left-2 badge text-xs">SALE</div>
                    )}
                  </div>
                  <p className="text-xs mb-1" style={{color: 'rgba(246,211,101,0.6)'}}>{product.categories?.name}</p>
                  <h3 className="font-semibold text-xs mb-2 line-clamp-2" style={{color: 'rgba(245,240,232,0.9)'}}>
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="gold-text font-black text-sm">₦{product.price.toLocaleString()}</span>
                    {product.compare_price && (
                      <span className="text-xs line-through" style={{color: 'rgba(245,240,232,0.3)'}}>
                        ₦{product.compare_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2 rounded-xl text-xs font-black text-white transition-all hover:scale-105 burgundy-btn"
                  >
                    + Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{background: '#0d0305'}}>
        <p className="text-yellow-400 text-xl">✨ Loading...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
