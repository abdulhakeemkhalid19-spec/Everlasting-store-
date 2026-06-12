'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'

function SearchContent() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [addedProduct, setAddedProduct] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
  })

  useEffect(() => {
    fetchCategories()
    const saved = JSON.parse(localStorage.getItem('everlasting-cart') || '[]')
    setCart(saved)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters])

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

    if (filters.query) {
      query = query.ilike('name', `%${filters.query}%`)
    }

    if (filters.category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('id', filters.category)
        .single()
      if (cat) query = query.eq('category_id', cat.id)
    }

    if (filters.minPrice) {
      query = query.gte('price', parseFloat(filters.minPrice))
    }

    if (filters.maxPrice) {
      query = query.lte('price', parseFloat(filters.maxPrice))
    }

    if (filters.sortBy === 'price_low') query = query.order('price', { ascending: true })
    else if (filters.sortBy === 'price_high') query = query.order('price', { ascending: false })
    else query = query.order('created_at', { ascending: false })

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
    setAddedProduct(product.id)
    setTimeout(() => setAddedProduct(null), 2000)
  }

  const getDiscount = (price: number, comparePrice: number) => {
    if (!comparePrice || comparePrice <= price) return null
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const inputStyle = {
    background: '#ffffff',
    border: '1px solid rgba(135,206,235,0.4)',
    color: '#2c2c2c',
    borderRadius: '10px',
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    fontSize: '13px',
  }

  return (
    <div className="min-h-screen" style={{background: '#f5f5f5'}}>

      {/* Navbar */}
      <nav style={{background: '#ffffff', borderBottom: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Logo size={36} />
              <div>
                <h1 className="text-lg font-black tracking-wider sky-text leading-tight">EVERLASTING</h1>
                <p className="text-xs tracking-widest leading-tight" style={{color: 'rgba(30,144,255,0.6)'}}>STORE</p>
              </div>
            </div>
          </Link>
          <Link href="/cart" className="relative shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'rgba(135,206,235,0.15)', border: '1px solid rgba(135,206,235,0.3)'}}>
              <span className="text-lg">🛒</span>
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center" style={{background: '#1E90FF', color: 'white'}}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color: '#1E90FF'}}>Find Products</p>
          <h1 className="text-2xl font-black" style={{color: '#2c2c2c'}}>Search & Filter</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Filters Sidebar */}
          <div className="md:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-5 sticky top-24" style={{border: '1px solid rgba(135,206,235,0.3)', boxShadow: '0 4px 15px rgba(135,206,235,0.1)'}}>
              <p className="text-sm font-black mb-4" style={{color: '#2c2c2c'}}>🔍 Filters</p>

              {/* Search */}
              <div className="mb-4">
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Search</label>
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => setFilters({...filters, query: e.target.value})}
                  placeholder="Search products..."
                  style={inputStyle}
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  style={inputStyle}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Price Range (₦)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    placeholder="Min"
                    style={{...inputStyle, width: '50%'}}
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    placeholder="Max"
                    style={{...inputStyle, width: '50%'}}
                  />
                </div>
              </div>

              {/* Quick price filters */}
              <div className="mb-4">
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Quick Price</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {label: 'Under ₦5k', min: '', max: '5000'},
                    {label: '₦5k-₦15k', min: '5000', max: '15000'},
                    {label: '₦15k-₦30k', min: '15000', max: '30000'},
                    {label: 'Above ₦30k', min: '30000', max: ''},
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setFilters({...filters, minPrice: range.min, maxPrice: range.max})}
                      className="text-xs py-2 px-2 rounded-lg font-bold transition hover:scale-105"
                      style={{
                        background: filters.minPrice === range.min && filters.maxPrice === range.max
                          ? 'linear-gradient(135deg, #1E90FF, #87CEEB)'
                          : 'rgba(135,206,235,0.1)',
                        color: filters.minPrice === range.min && filters.maxPrice === range.max
                          ? 'white' : '#1E90FF',
                        border: '1px solid rgba(135,206,235,0.3)',
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-4">
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  style={inputStyle}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>

              {/* Clear filters */}
              <button
                onClick={() => setFilters({query: '', category: '', minPrice: '', maxPrice: '', sortBy: 'newest'})}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
                style={{background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171'}}
              >
                🗑️ Clear Filters
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold" style={{color: 'rgba(44,44,44,0.6)'}}>
                {loading ? 'Searching...' : `${products.length} products found`}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3 animate-pulse">🔍</p>
                <p style={{color: 'rgba(44,44,44,0.4)'}}>Searching products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">😕</p>
                <p className="text-lg font-black mb-2" style={{color: '#2c2c2c'}}>No products found</p>
                <p className="text-sm mb-6" style={{color: 'rgba(44,44,44,0.5)'}}>Try different filters or search terms</p>
                <button
                  onClick={() => setFilters({query: '', category: '', minPrice: '', maxPrice: '', sortBy: 'newest'})}
                  className="px-6 py-3 rounded-full font-bold text-white sky-btn"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((product) => {
                  const discount = getDiscount(product.price, product.compare_price)
                  const isAdded = addedProduct === product.id
                  return (
                    <div key={product.id} className="bg-white rounded-lg overflow-hidden" style={{border: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
                      <Link href={`/product/${product.id}`}>
                        <div className="relative" style={{background: '#f9f9f9', height: '160px'}}>
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl">✨</span>
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
                        <p className="text-xs mb-1" style={{color: 'rgba(30,144,255,0.7)'}}>{product.categories?.name}</p>
                        <Link href={`/product/${product.id}`}>
                          <p className="text-xs mb-2 line-clamp-2 hover:text-blue-500 transition" style={{color: '#2c2c2c', minHeight: '30px'}}>
                            {product.name}
                          </p>
                        </Link>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-sm" style={{color: '#1E90FF'}}>₦{product.price.toLocaleString()}</span>
                          {product.compare_price && product.compare_price > product.price && (
                            <span className="text-xs line-through" style={{color: '#999'}}>₦{product.compare_price.toLocaleString()}</span>
                          )}
                        </div>
                        {discount && (
                          <p className="text-xs font-bold mb-2" style={{color: '#ff4444'}}>-{discount}%</p>
                        )}
                        <p className="text-xs mb-2" style={{color: '#3aaa35'}}>✓ In Stock</p>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full py-2 rounded font-bold text-xs text-white transition-all sky-btn"
                          style={{
                            background: isAdded ? 'linear-gradient(135deg, #34d399, #059669)' : undefined
                          }}
                        >
                          {isAdded ? '✅ Added!' : '🛒 Add to Cart'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{background: 'white', borderTop: '1px solid #e0e0e0', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'}}>
          <Link href="/cart" className="flex items-center justify-between px-6 py-3 rounded-full font-black text-white w-full sky-btn">
            <span>🛒 {cartCount} items</span>
            <span>₦{cartTotal.toLocaleString()} → Order</span>
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer style={{background: '#ffffff', borderTop: '1px solid #e0e0e0'}} className="py-12 px-4 mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-3"><Logo size={40} /></div>
          <h2 className="text-2xl font-black mb-1 sky-text">EVERLASTING STORE</h2>
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{background: '#f5f5f5'}}>
        <p className="text-blue-400 text-xl animate-pulse">🔍 Loading...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
