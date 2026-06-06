'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    compare_price: '',
    image_url: '',
    category_id: '',
    stock_quantity: '100',
    is_active: true,
  })

  useEffect(() => {
    const adminAuth = localStorage.getItem('everlasting-admin')
    if (adminAuth !== 'true') router.push('/admin')
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    if (data) setCategories(data)
  }

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error } = await supabase.storage
        .from('Product')
        .upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data: urlData } = supabase.storage
        .from('Product')
        .getPublicUrl(fileName)
      setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }))
    } catch (error: any) {
      alert('Image upload failed: ' + error.message)
    }
    setUploadingImage(false)
  }

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category_id) {
      alert('Please fill in Name, Price and Category!')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('products').insert({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      image_url: form.image_url || null,
      category_id: form.category_id,
      stock_quantity: parseInt(form.stock_quantity) || 100,
      is_active: form.is_active,
    })
    if (error) {
      alert('Error adding product: ' + error.message)
    } else {
      alert('✅ Product added successfully!')
      router.push('/admin')
    }
    setLoading(false)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(180,120,40,0.3)',
    color: 'white',
    borderRadius: '12px',
    padding: '12px 16px',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
  }

  return (
    <div className="min-h-screen" style={{background: '#0d0305'}}>

      {/* Navbar */}
      <nav style={{background: 'linear-gradient(180deg, #1a0508 0%, rgba(26,5,8,0.97) 100%)', borderBottom: '1px solid rgba(180,120,40,0.3)'}} className="sticky top-0 z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <h1 className="text-xl font-black tracking-wider gold-text">✦ EVERLASTING</h1>
            </Link>
            <span className="text-xs px-3 py-1 rounded-full font-bold" style={{background: 'rgba(180,120,40,0.2)', border: '1px solid rgba(180,120,40,0.4)', color: '#f6d365'}}>
              ADMIN
            </span>
          </div>
          <Link href="/admin" className="text-sm transition" style={{color: 'rgba(246,211,101,0.7)'}}>
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color: '#f6d365'}}>New Item</p>
          <h1 className="text-3xl font-black text-white">Add Product</h1>
        </div>

        <div className="card p-6 space-y-5">

          {/* Image Upload */}
          <div>
            <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: 'rgba(245,240,232,0.5)'}}>
              Product Image
            </label>
            <div
              className="w-full py-6 rounded-xl text-center cursor-pointer transition hover:scale-105"
              style={{background: 'rgba(107,21,48,0.15)', border: '2px dashed rgba(180,120,40,0.4)'}}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {uploadingImage ? (
                <p className="text-sm" style={{color: '#f6d365'}}>⏳ Uploading image...</p>
              ) : form.image_url ? (
                <div>
                  <img src={form.image_url} alt="Preview" className="h-32 rounded-xl object-cover mx-auto mb-2" />
                  <p className="text-xs" style={{color: 'rgba(246,211,101,0.6)'}}>Tap to change image</p>
                </div>
              ) : (
                <>
                  <p className="text-4xl mb-2">📸</p>
                  <p className="text-sm font-bold" style={{color: '#f6d365'}}>Tap to upload from phone</p>
                  <p className="text-xs mt-1" style={{color: 'rgba(245,240,232,0.4)'}}>JPG, PNG, WEBP supported</p>
                </>
              )}
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <p className="text-xs text-center mt-2 mb-2" style={{color: 'rgba(245,240,232,0.3)'}}>— or paste image URL below —</p>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: 'rgba(245,240,232,0.5)'}}>
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Oud Al Shams Perfume 100ml"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: 'rgba(245,240,232,0.5)'}}>
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the product..."
              rows={3}
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: 'rgba(245,240,232,0.5)'}}>
                Selling Price (₦) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 15000"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: 'rgba(245,240,232,0.5)'}}>
                Original Price (₦)
              </label>
              <input
                type="number"
                name="compare_price"
                value={form.compare_price}
                onChange={handleChange}
                placeholder="e.g. 18000"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: 'rgba(245,240,232,0.5)'}}>
              Category *
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              style={{...inputStyle, background: '#1a0508'}}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} style={{background: '#1a0508'}}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: 'rgba(245,240,232,0.5)'}}>
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock_quantity"
              value={form.stock_quantity}
              onChange={handleChange}
              placeholder="e.g. 100"
              style={inputStyle}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold" style={{color: 'rgba(245,240,232,0.6)'}}>
              ✅ Active (visible in store)
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={loading || uploadingImage}
            className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:scale-105 disabled:opacity-40 burgundy-btn"
          >
            {loading ? '⏳ Adding...' : '➕ Add Product'}
          </button>

        </div>
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
