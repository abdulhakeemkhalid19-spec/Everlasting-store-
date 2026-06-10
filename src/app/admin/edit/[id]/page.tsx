'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import Logo from '@/components/Logo'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
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
    fetchProduct()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    if (data) setCategories(data)
  }

  const fetchProduct = async () => {
    const { data } = await supabase.from('products').select('*').eq('id', id).single()
    if (data) {
      setForm({
        name: data.name || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        compare_price: data.compare_price?.toString() || '',
        image_url: data.image_url || '',
        category_id: data.category_id || '',
        stock_quantity: data.stock_quantity?.toString() || '100',
        is_active: data.is_active ?? true,
      })
    }
    setFetching(false)
  }

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('Product').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data: urlData } = supabase.storage.from('Product').getPublicUrl(fileName)
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
    const { error } = await supabase.from('products').update({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      image_url: form.image_url || null,
      category_id: form.category_id,
      stock_quantity: parseInt(form.stock_quantity) || 100,
      is_active: form.is_active,
    }).eq('id', id)
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('✅ Product updated!')
      router.push('/admin')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${form.name}"?`)) return
    setLoading(true)
    await supabase.from('products').delete().eq('id', id)
    alert('Deleted!')
    router.push('/admin')
    setLoading(false)
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

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: '#fdf8f0'}}>
        <p style={{color: '#1E90FF'}} className="text-xl">✨ Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{background: '#fdf8f0'}}>

      <nav style={{background: '#ffffff', borderBottom: '1px solid rgba(135,206,235,0.4)', boxShadow: '0 2px 20px rgba(135,206,235,0.15)'}} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={36} />
            <div>
              <h1 className="text-lg font-black tracking-wider sky-text leading-tight">EVERLASTING</h1>
              <p className="text-xs tracking-widest leading-tight" style={{color: 'rgba(30,144,255,0.6)'}}>ADMIN</p>
            </div>
          </div>
          <Link href="/admin" className="text-sm transition" style={{color: '#1E90FF'}}>← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color: '#1E90FF'}}>Edit Item</p>
          <h1 className="text-3xl font-black" style={{color: '#2c2c2c'}}>Edit Product</h1>
        </div>

        <div className="card p-6 space-y-5">

          <div>
            <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Product Image</label>
            <div
              className="w-full py-6 rounded-xl text-center cursor-pointer transition hover:scale-105"
              style={{background: 'rgba(135,206,235,0.08)', border: '2px dashed rgba(135,206,235,0.5)'}}
              onClick={() => document.getElementById('image-upload-edit')?.click()}
            >
              {uploadingImage ? (
                <p className="text-sm" style={{color: '#1E90FF'}}>⏳ Uploading...</p>
              ) : form.image_url ? (
                <div>
                  <img src={form.image_url} alt="Preview" className="h-32 rounded-xl object-cover mx-auto mb-2" />
                  <p className="text-xs" style={{color: '#1E90FF'}}>Tap to change</p>
                </div>
              ) : (
                <>
                  <p className="text-4xl mb-2">📸</p>
                  <p className="text-sm font-bold" style={{color: '#1E90FF'}}>Tap to upload from phone</p>
                </>
              )}
            </div>
            <input id="image-upload-edit" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <p className="text-xs text-center mt-2 mb-2" style={{color: 'rgba(44,44,44,0.3)'}}>— or paste image URL —</p>
            <input type="text" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" style={inputStyle} />
          </div>

          <div>
            <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Product Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Selling Price (₦) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Original Price (₦)</label>
              <input type="number" name="compare_price" value={form.compare_price} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Category *</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} style={{...inputStyle, background: '#ffffff'}}>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Stock Quantity</label>
            <input type="number" name="stock_quantity" value={form.stock_quantity} onChange={handleChange} style={inputStyle} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4" />
            <span className="text-sm font-semibold" style={{color: '#2c2c2c'}}>✅ Active (visible in store)</span>
          </label>

          <button onClick={handleSubmit} disabled={loading || uploadingImage} className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:scale-105 disabled:opacity-40 sky-btn">
            {loading ? '⏳ Saving...' : '✅ Save Changes'}
          </button>

          <button onClick={handleDelete} disabled={loading} className="w-full py-4 rounded-xl font-black text-lg transition-all hover:scale-105 disabled:opacity-40" style={{background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171'}}>
            🗑️ Delete Product
          </button>

        </div>
      </div>

      <footer style={{background: '#ffffff', borderTop: '1px solid rgba(135,206,235,0.3)'}} className="py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-1 sky-text">EVERLASTING STORE</h2>
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
