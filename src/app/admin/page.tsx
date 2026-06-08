'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const ADMIN_PASSWORD = 'everlasting2024'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ totalProducts: 0, totalCategories: 0 })
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const adminAuth = localStorage.getItem('everlasting-admin')
    if (adminAuth === 'true') {
      setIsLoggedIn(true)
      fetchStats()
      fetchProducts()
    }
  }, [])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('everlasting-admin', 'true')
      setIsLoggedIn(true)
      setError('')
      fetchStats()
      fetchProducts()
    } else {
      setError('Wrong password! Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('everlasting-admin')
    setIsLoggedIn(false)
  }

  const fetchStats = async () => {
    const { data: products } = await supabase.from('products').select('id')
    const { data: categories } = await supabase.from('categories').select('id')
    setStats({
      totalProducts: products?.length || 0,
      totalCategories: categories?.length || 0,
    })
  }

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
    fetchStats()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_active: !current }).eq('id', id)
    fetchProducts()
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{background: '#fdf8f0'}}>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 pointer-events-none" style={{background: 'radial-gradient(circle, #87CEEB, transparent)', filter: 'blur(80px)'}}></div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-wider sky-text">✦ EVERLASTING</h1>
            <p className="text-xs tracking-widest mt-1" style={{color: 'rgba(30,144,255,0.5)'}}>STORE ADMIN</p>
          </div>

          <div className="card p-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-6 text-center" style={{color: '#1E90FF'}}>
              🔐 Admin Access
            </p>

            {error && (
              <div className="rounded-xl p-3 mb-4" style={{background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)'}}>
                <p className="text-xs text-red-400 text-center">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: 'rgba(44,44,44,0.5)'}}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                style={{background: 'rgba(135,206,235,0.1)', border: '1px solid rgba(135,206,235,0.3)', color: '#2c2c2c'}}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:scale-105 sky-btn"
            >
              🔐 Login
            </button>

            <div className="mt-6 text-center">
              <Link href="/" className="text-xs transition" style={{color: 'rgba(30,144,255,0.5)'}}>
                ← Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{background: '#fdf8f0'}}>

      {/* Navbar */}
      <nav style={{background: '#ffffff', borderBottom: '1px solid rgba(135,206,235,0.4)', boxShadow: '0 2px 20px rgba(135,206,235,0.15)'}} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <h1 className="text-xl font-black tracking-wider sky-text">✦ EVERLASTING</h1>
            </Link>
            <span className="text-xs px-3 py-1 rounded-full font-bold" style={{background: 'rgba(135,206,235,0.2)', border: '1px solid rgba(135,206,235,0.4)', color: '#1E90FF'}}>
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/add" className="text-xs px-4 py-2 rounded-full font-bold text-white transition hover:scale-105 sky-btn">
              ➕ Add Product
            </Link>
            <Link href="/admin/ai" className="text-xs px-4 py-2 rounded-full font-bold text-white transition hover:scale-105 sky-btn">
              🤖 AI Upload
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs px-4 py-2 rounded-full font-bold transition hover:scale-105"
              style={{background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171'}}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color: '#1E90FF'}}>Overview</p>
          <h1 className="text-3xl font-black" style={{color: '#2c2c2c'}}>Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {icon: '🛍️', value: stats.totalProducts, label: 'Total Products', color: '#1E90FF'},
            {icon: '📂', value: stats.totalCategories, label: 'Categories', color: '#87CEEB'},
            {icon: '✅', value: products.filter(p => p.is_active).length, label: 'Active', color: '#34d399'},
            {icon: '❌', value: products.filter(p => !p.is_active).length, label: 'Hidden', color: '#f87171'},
          ].map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-2xl font-black mb-1" style={{color: stat.color}}>{stat.value}</p>
              <p className="text-xs" style={{color: 'rgba(44,44,44,0.4)'}}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            {href: '/admin/add', icon: '➕', label: 'Add Product'},
            {href: '/admin/ai', icon: '🤖', label: 'AI Upload'},
            {href: '/', icon: '👁️', label: 'View Store'},
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="card p-5 text-center group hover:scale-105 transition-transform"
            >
              <p className="text-3xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</p>
              <p className="text-sm font-bold group-hover:text-blue-500 transition-colors" style={{color: '#1E90FF'}}>
                {action.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Products List */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black" style={{color: '#2c2c2c'}}>All Products</h2>
            <Link href="/admin/add" className="text-xs px-4 py-2 rounded-full font-bold text-white transition hover:scale-105 sky-btn">
              ➕ Add New
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-3">✨</p>
              <p style={{color: 'rgba(44,44,44,0.4)'}}>No products yet. Add your first product!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{borderBottom: '1px solid rgba(135,206,235,0.3)'}}>
                    {['Product', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left py-3 pr-4 text-xs font-bold uppercase tracking-wider" style={{color: 'rgba(30,144,255,0.6)'}}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} style={{borderBottom: '1px solid rgba(135,206,235,0.1)'}} className="hover:bg-blue-50 transition">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{background: 'rgba(135,206,235,0.15)'}}>
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><span>✨</span></div>
                            )}
                          </div>
                          <span className="font-semibold line-clamp-1 max-w-32" style={{color: '#2c2c2c'}}>
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-xs" style={{color: 'rgba(44,44,44,0.4)'}}>
                        {product.categories?.name || '-'}
                      </td>
                      <td className="py-4 pr-4 font-black sky-text">
                        ₦{product.price.toLocaleString()}
                      </td>
                      <td className="py-4 pr-4">
                        <button
                          onClick={() => toggleActive(product.id, product.is_active)}
                          className="px-3 py-1 rounded-full text-xs font-bold transition hover:scale-105"
                          style={product.is_active
                            ? {background: 'rgba(52,211,153,0.15)', color: '#34d399'}
                            : {background: 'rgba(248,113,113,0.15)', color: '#f87171'}
                          }
                        >
                          {product.is_active ? '✅ Active' : '❌ Hidden'}
                        </button>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/admin/edit/${product.id}`} className="text-xs font-bold transition" style={{color: '#1E90FF'}}>
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id, product.name)}
                            className="text-xs font-bold text-red-400 hover:text-red-500 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <footer style={{background: '#ffffff', borderTop: '1px solid rgba(135,206,235,0.3)'}} className="py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-1 sky-text">✦ EVERLASTING</h2>
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
      }
