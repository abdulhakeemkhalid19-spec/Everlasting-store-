'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import Logo from '@/components/Logo'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    fetchProduct()
    const saved = JSON.parse(localStorage.getItem('everlasting-cart') || '[]')
    setCart(saved)
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('id', id)
      .single()
    if (data) {
      setProduct(data)
      fetchRelated(data.category_id, data.id)
    }
    setLoading(false)
  }

  const fetchRelated = async (categoryId: string, currentId: string) => {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .neq('id', currentId)
      .limit(4)
    if (data) setRelatedProducts(data)
  }

  const addToCart = () => {
    const saved = JSON.parse(localStorage.getItem('everlasting-cart') || '[]')
    const existing = saved.find((item: any) => item.id === product.id)
    let updated
    if (existing) {
      updated = saved.map((item: any) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      updated = [...saved, { ...product, quantity, selectedSize }]
    }
    localStorage.setItem('everlasting-cart', JSON.stringify(updated))
    setCart(updated)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const getDiscount = (price: number, comparePrice: number) => {
    if (!comparePrice || comparePrice <= price) return null
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  const isFashion = product?.categories?.slug === 'abayas' ||
    product?.categories?.slug === 'jalabiya' ||
    product?.categories?.slug === 'ladies-fashion' ||
    product?.categories?.slug === 'mens-fashion' ||
    product?.categories?.slug === 'kids-wear'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: '#fdf8f0'}}>
        <p style={{color: '#1E90FF'}} className="text-xl animate-pulse">✨ Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: '#fdf8f0'}}>
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-xl font-black mb-4" style={{color: '#2c2c2c'}}>Product not found</p>
          <Link href="/shop" className="px-8 py-3 rounded-full font-bold text-white sky-btn">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const discount = getDiscount(product.price, product.compare_price)

  return (
    <div className="min-h-screen" style={{background: '#fdf8f0'}}>

      {/* Navbar */}
      <nav style={{background: '#ffffff', borderBottom: '1px solid rgba(135,206,235,0.4)', boxShadow: '0 2px 20px rgba(135,206,235,0.15)'}} className="sticky top-0 z-50">
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

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 text-xs" style={{color: 'rgba(44,44,44,0.5)'}}>
          <Link href="/" className="hover:text-blue-500 transition">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-blue-500 transition">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.categories?.slug}`} className="hover:text-blue-500 transition">
            {product.categories?.name}
          </Link>
          <span>/</span>
          <span className="line-clamp-1" style={{color: '#1E90FF'}}>{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden" style={{background: '#f5f5f5', aspectRatio: '1/1'}}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">✨</span>
                </div>
              )}
              {discount && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-sm font-black text-white" style={{background: '#ff4444'}}>
                  -{discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col gap-4">

            {/* Category */}
            <p className="text-xs font-bold uppercase tracking-widest" style={{color: '#1E90FF'}}>
              {product.categories?.name}
            </p>

            {/* Name */}
            <h1 className="text-2xl font-black leading-tight" style={{color: '#2c2c2c'}}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-black sky-text">
                ₦{product.price.toLocaleString()}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-lg line-through" style={{color: '#999'}}>
                  ₦{product.compare_price.toLocaleString()}
                </span>
              )}
              {discount && (
                <span className="px-3 py-1 rounded-full text-sm font-black text-white" style={{background: '#ff4444'}}>
                  Save ₦{(product.compare_price - product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* In Stock */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{background: '#3aaa35'}}></div>
              <p className="text-sm font-bold" style={{color: '#3aaa35'}}>In Stock</p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="rounded-xl p-4" style={{background: 'rgba(135,206,235,0.08)', border: '1px solid rgba(135,206,235,0.2)'}}>
                <p className="text-sm leading-relaxed" style={{color: 'rgba(44,44,44,0.7)'}}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selector */}
            {isFashion && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color: '#2c2c2c'}}>
                  Select Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="w-12 h-12 rounded-xl text-sm font-bold transition-all hover:scale-105"
                      style={selectedSize === size
                        ? {background: '#1E90FF', color: 'white', border: '2px solid #1E90FF'}
                        : {background: 'white', color: '#2c2c2c', border: '2px solid rgba(135,206,235,0.4)'}
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color: '#2c2c2c'}}>
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full font-bold flex items-center justify-center transition hover:scale-110"
                  style={{background: 'rgba(135,206,235,0.2)', border: '1px solid rgba(135,206,235,0.4)', color: '#1E90FF'}}
                >-</button>
                <span className="w-10 text-center font-black text-lg" style={{color: '#2c2c2c'}}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full font-bold flex items-center justify-center transition hover:scale-110"
                  style={{background: 'rgba(135,206,235,0.2)', border: '1px solid rgba(135,206,235,0.4)', color: '#1E90FF'}}
                >+</button>
                <span className="text-sm" style={{color: 'rgba(44,44,44,0.4)'}}>
                  Subtotal: <span className="font-black sky-text">₦{(product.price * quantity).toLocaleString()}</span>
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:scale-105"
              style={{
                background: added
                  ? 'linear-gradient(135deg, #34d399, #059669)'
                  : 'linear-gradient(135deg, #1E90FF, #87CEEB)',
                boxShadow: '0 8px 30px rgba(30,144,255,0.3)'
              }}
            >
              {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
            </button>

            {/* Go to Cart */}
            {cartCount > 0 && (
              <Link
                href="/cart"
                className="w-full py-4 rounded-xl font-black text-center transition-all hover:scale-105 block"
                style={{background: 'rgba(37,211,102,0.1)', border: '2px solid #25d366', color: '#25d366'}}
              >
                📱 View Cart & Order via WhatsApp ({cartCount} items — ₦{cartTotal.toLocaleString()})
              </Link>
            )}

            {/* Delivery Info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {icon: '🚚', title: 'Fast Delivery', desc: 'Delivered to your address'},
                {icon: '💬', title: 'WhatsApp Order', desc: 'Easy ordering process'},
                {icon: '💯', title: 'Quality Assured', desc: 'Premium products only'},
                {icon: '💳', title: 'Easy Payment', desc: 'Bank transfer after order'},
              ].map((info) => (
                <div key={info.title} className="rounded-xl p-3" style={{background: 'rgba(135,206,235,0.08)', border: '1px solid rgba(135,206,235,0.2)'}}>
                  <p className="text-lg mb-1">{info.icon}</p>
                  <p className="text-xs font-bold" style={{color: '#2c2c2c'}}>{info.title}</p>
                  <p className="text-xs" style={{color: 'rgba(44,44,44,0.5)'}}>{info.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black mb-6" style={{color: '#2c2c2c'}}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((related) => {
                const relDiscount = getDiscount(related.price, related.compare_price)
                return (
                  <Link key={related.id} href={`/product/${related.id}`} className="bg-white rounded-lg overflow-hidden" style={{border: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
                    <div className="relative" style={{background: '#f9f9f9', height: '160px'}}>
                      {related.image_url ? (
                        <img src={related.image_url} alt={related.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">✨</span>
                        </div>
                      )}
                      {relDiscount && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-black text-white" style={{background: '#ff4444'}}>
                          -{relDiscount}%
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs line-clamp-2 mb-2" style={{color: '#2c2c2c'}}>{related.name}</p>
                      <p className="font-black text-sm sky-text">₦{related.price.toLocaleString()}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
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
            <span>₦{cartTotal.toLocaleString()} → Order</span>
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer style={{background: '#ffffff', borderTop: '1px solid rgba(135,206,235,0.3)'}} className="py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-3">
            <Logo size={40} />
          </div>
          <h2 className="text-2xl font-black mb-1 sky-text">EVERLASTING STORE</h2>
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
