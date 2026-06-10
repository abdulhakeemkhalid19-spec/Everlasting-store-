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
  const [addedProduct, setAddedProduct] = useState<string | null>(null)
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
    setAddedProduct(product.id)
    setTimeout(() => setAddedProduct(null), 2000)
  }

  const getDiscount = (price: number, comparePrice: number) => {
    if (!comparePrice || comparePrice <= price) return null
    return Math.round(((comparePrice - price) / comparePrice) * 100)
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
    <div className="min-h-screen" style={{background: '#f5f5f5'}}>

      {/* Navbar */}
      <nav style={{background: '#ffffff', borderBottom: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/">
            <div>
              <h1 className="text-xl font-black tracking-wider sky-text">✦ EVERLASTING</h1>
              <p className="text-xs tracking-widest" style={{color: 'rgba(30,144,255,0.6)'}}>STORE</p>
            </div>
          </Link>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full outline-none text-sm"
                style={{background: '#f5f5f5', border: '1px solid #e0e0e0', color: '#2c2c2c'}}
              />
              <span className="absolute right-3 top-2.5" style={{color: '#1E90FF'}}>🔍</span>
            </div>
          </div>
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

      {/* Category tabs */}
      <div style={{background: '#ffffff', borderBottom: '1px solid #e0e0e0'}}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('')}
              className="shrink-0 px-4 py-3 text-xs font-bold border-b-2 transition-all"
              style={selectedCategory === ''
                ? {borderColor: '#1E90FF', color: '#1E90FF'}
                : {borderColor: 'transparent', color: 'rgba(44,44,44,0.5)'}
              }
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className="shrink-0 px-4 py-3 text-xs font-bold border-b-2 transition-all"
                style={selectedCategory === cat.slug
                  ? {borderColor: '#1E90FF', color: '#1E90FF'}
                  : {borderColor: 'transparent', color: 'rgba(44,44,44,0.5)'}
                }
              >
                {categoryIcons[cat.slug]} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 py-4">

        {/* Results count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.5)'}}>
            {products.length} products found
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">✨</p>
            <p style={{color: 'rgba(44,44,44,0.4)'}}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">✨</p>
            <p className="text-lg mb-2" style={{color: 'rgba(44,44,44,0.4)'}}>No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {products.map((product) => {
              const discount = getDiscount(product.price, product.compare_price)
              const isAdded = addedProduct === product.id
              return (
                     <div key={product.id} className="bg-white rounded-lg overflow-hidden" style={{border: '1px solid #e8e8e8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
                                    <Link href={`/product/${product.id}`}>
                  {/* Product Image */}
                  <div className="relative" style={{background: '#f9f9f9', height: '180px'}}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
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

                  {/* Product Info */}
                  <div className="p-3">
                    <p className="text-xs mb-1 line-clamp-2 leading-snug" style={{color: '#2c2c2c', minHeight: '32px'}}>
                      {product.name}
                    </p>

                    {/* Price Section - Jumia Style */}
                    <div className="mt-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black" style={{color: '#1E90FF'}}>
                          ₦{product.price.toLocaleString()}
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-xs line-through" style={{color: '#999'}}>
                            ₦{product.compare_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {discount && (
                        <p className="text-xs font-bold mt-0.5" style={{color: '#ff4444'}}>
                          -{discount}%
                        </p>
                      )}
                    </div>

                    {/* In Stock */}
                    <p className="text-xs mb-3" style={{color: '#3aaa35'}}>
                      ✓ In Stock
                    </p>

                    {/* Add to Cart Button - Jumia Style */}
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2.5 rounded font-bold text-sm text-white transition-all"
                      style={{
                        background: isAdded
                          ? 'linear-gradient(135deg, #34d399, #059669)'
                          : 'linear-gradient(135deg, #1E90FF, #87CEEB)',
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

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{background: 'white', borderTop: '1px solid #e0e0e0', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'}}>
          <Link
            href="/cart"
            className="flex items-center justify-between px-6 py-3 rounded-full font-black text-white w-full transition-all hover:scale-105"
            style={{background: 'linear-gradient(135deg, #1E90FF, #87CEEB)'}}
          >
            <span>🛒 {cartCount} items in cart</span>
            <span>₦{cartTotal.toLocaleString()} → Order</span>
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer style={{background: '#ffffff', borderTop: '1px solid #e0e0e0'}} className="py-12 px-4 mt-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-1 sky-text">✦ EVERLASTING</h2>
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{background: '#f5f5f5'}}>
        <p className="text-blue-400 text-xl">✨ Loading...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
            }
