'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

const UNSPLASH_IMAGES: any = {
  perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500',
  fragrance: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500',
  abaya: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=500',
  jalabiya: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=500',
  slides: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
  footwear: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
  fashion: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
  clothing: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
  accessories: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=500',
  kids: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500',
  default: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500',
}

function getImage(name: string, category: string): string {
  const combined = (name + ' ' + category).toLowerCase()
  for (const key of Object.keys(UNSPLASH_IMAGES)) {
    if (combined.includes(key)) return UNSPLASH_IMAGES[key]
  }
  return UNSPLASH_IMAGES.default
}

export default function AIUploadPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [productName, setProductName] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generated, setGenerated] = useState(false)
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
      const { error } = await supabase.storage.from('Product').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data: urlData } = supabase.storage.from('Product').getPublicUrl(fileName)
      setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }))
    } catch (error: any) {
      alert('Image upload failed: ' + error.message)
    }
    setUploadingImage(false)
  }

  const generateWithAI = async () => {
    if (!productName.trim()) {
      alert('Please enter a product name!')
      return
    }
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
    if (!apiKey) {
      alert('OpenRouter API key is missing!')
      return
    }
    setLoading(true)
    setGenerated(false)
    try {
      const prompt = [
        'Generate product details for a Nigerian fashion and perfume store called Everlasting Store.',
        'Product: ' + productName,
        'Return ONLY a JSON object with these fields:',
        'name (full product name), description (2-3 sentences), price (realistic Nigerian Naira as number), compare_price (10 percent higher as number), category (one of: Perfumes, Abayas, Jalabiya, Slides and Footwear, Ladies Fashion, Mens Fashion, Accessories, Kids Wear)',
        'Return only JSON no other text.',
      ].join(' ')

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
          'HTTP-Referer': 'https://everlasting-store.vercel.app',
          'X-Title': 'Everlasting Store',
        },
        body: JSON.stringify({
          model: 'openrouter/auto',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 400,
          temperature: 0.7,
        }),
      })

      if (!response.ok) throw new Error('API error ' + response.status)
      const data = await response.json()
      const text = data.choices?.[0]?.message?.content || ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      const parsed = JSON.parse(jsonMatch[0])

      const matchedCategory = categories.find((cat) =>
        cat.name.toLowerCase().includes((parsed.category || '').toLowerCase().split(' ')[0])
      )

      setForm({
        name: parsed.name || productName,
        description: parsed.description || '',
        price: parsed.price?.toString() || '',
        compare_price: parsed.compare_price?.toString() || '',
        image_url: getImage(productName, parsed.category || ''),
        category_id: matchedCategory?.id || '',
        stock_quantity: '100',
        is_active: true,
      })
      setGenerated(true)
    } catch (error: any) {
      alert('AI generation failed: ' + error.message)
    }
    setLoading(false)
  }

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category_id) {
      alert('Please fill in Name, Price and Category!')
      return
    }
    setSaving(true)
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
      alert('Error: ' + error.message)
    } else {
      alert('✅ Product added!')
      setProductName('')
      setForm({ name: '', description: '', price: '', compare_price: '', image_url: '', category_id: '', stock_quantity: '100', is_active: true })
      setGenerated(false)
    }
    setSaving(false)
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color: '#1E90FF'}}>AI Powered</p>
          <h1 className="text-3xl font-black" style={{color: '#2c2c2c'}}>AI Product Upload</h1>
          <p className="text-sm mt-2" style={{color: 'rgba(44,44,44,0.5)'}}>Type a product name and AI fills everything automatically!</p>
        </div>

        <div className="card p-6 mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{color: '#1E90FF'}}>🤖 Enter Product Name</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateWithAI()}
              placeholder="e.g. Oud Al Shams Perfume, Black Abaya, Nike Slides..."
              className="flex-1 px-4 py-3 rounded-xl outline-none text-sm"
              style={{background: '#f5f5f5', border: '1px solid rgba(135,206,235,0.4)', color: '#2c2c2c'}}
            />
            <button onClick={generateWithAI} disabled={loading} className="px-6 py-3 rounded-xl font-black text-white transition hover:scale-105 disabled:opacity-40 shrink-0 sky-btn">
              {loading ? '⏳' : '🤖 Generate'}
            </button>
          </div>
          {loading && <p className="text-sm mt-4 text-center animate-pulse" style={{color: '#1E90FF'}}>🤖 AI is generating product details...</p>}
        </div>

        {generated && (
          <div className="card p-6 space-y-5">
            <p className="font-bold text-sm" style={{color: '#34d399'}}>✅ AI filled the details! Review and save.</p>

            <div>
              <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Product Image</label>
              <div
                className="w-full py-4 rounded-xl text-center cursor-pointer transition hover:scale-105 mb-3"
                style={{background: 'rgba(135,206,235,0.08)', border: '2px dashed rgba(135,206,235,0.4)'}}
                onClick={() => document.getElementById('ai-image-upload')?.click()}
              >
                {uploadingImage ? (
                  <p className="text-sm" style={{color: '#1E90FF'}}>⏳ Uploading...</p>
                ) : form.image_url ? (
                  <div>
                    <img src={form.image_url} alt="Preview" className="h-24 rounded-xl object-cover mx-auto mb-2" onError={(e: any) => e.target.style.display='none'} />
                    <p className="text-xs" style={{color: '#1E90FF'}}>Tap to change</p>
                  </div>
                ) : (
                  <p className="text-sm" style={{color: '#1E90FF'}}>📸 Tap to upload from phone</p>
                )}
              </div>
              <input id="ai-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <input type="text" name="image_url" value={form.image_url} onChange={handleChange} placeholder="or paste image URL" style={inputStyle} />
            </div>

            <div>
              <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Product Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={inputStyle} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Selling Price (₦)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Original Price (₦)</label>
                <input type="number" name="compare_price" value={form.compare_price} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} style={{...inputStyle, background: '#ffffff'}}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex-1 py-4 rounded-xl font-black text-white transition hover:scale-105 disabled:opacity-40 sky-btn">
                {saving ? '⏳ Saving...' : '✅ Save Product'}
              </button>
              <button
                onClick={async () => { await handleSave(); setProductName(''); setGenerated(false) }}
                disabled={saving}
                className="flex-1 py-4 rounded-xl font-black transition hover:scale-105 disabled:opacity-40"
                style={{background: 'rgba(135,206,235,0.15)', border: '1px solid rgba(135,206,235,0.4)', color: '#1E90FF'}}
              >
                {saving ? '⏳' : '➕ Save & Add Another'}
              </button>
            </div>
          </div>
        )}

        {!generated && !loading && (
          <div className="card p-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{color: '#1E90FF'}}>💡 Tips</p>
            <div className="space-y-2 text-sm" style={{color: 'rgba(44,44,44,0.5)'}}>
              <p>• Perfume: <span style={{color: '#1E90FF'}}>"Oud Al Shams 100ml"</span></p>
              <p>• Abaya: <span style={{color: '#1E90FF'}}>"Black Embroidered Abaya"</span></p>
              <p>• Slides: <span style={{color: '#1E90FF'}}>"Nike Benassi Slides White"</span></p>
              <p>• Jalabiya: <span style={{color: '#1E90FF'}}>"White Cotton Jalabiya Men"</span></p>
            </div>
          </div>
        )}
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
