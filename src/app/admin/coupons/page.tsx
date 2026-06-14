'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

export default function CouponsPage() {
  const router = useRouter()
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    code: '',
    type: 'fixed',
    value: '',
    min_order: '',
    max_uses: '100',
    expires_at: '',
  })

  useEffect(() => {
    const adminAuth = localStorage.getItem('everlasting-admin')
    if (adminAuth !== 'true') router.push('/admin')
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    if (data) setCoupons(data)
  }

  const handleCreate = async () => {
    if (!form.code || !form.value) {
      alert('Please fill in Code and Value!')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('coupons').insert({
      code: form.code.toUpperCase(),
      type: form.type,
      value: parseFloat(form.value),
      min_order: parseFloat(form.min_order) || 0,
      max_uses: parseInt(form.max_uses) || 100,
      expires_at: form.expires_at || null,
      is_active: true,
    })
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('✅ Coupon created!')
      setForm({ code: '', type: 'fixed', value: '', min_order: '', max_uses: '100', expires_at: '' })
      setShowForm(false)
      fetchCoupons()
    }
    setLoading(false)
  }

  const toggleCoupon = async (id: string, current: boolean) => {
    await supabase.from('coupons').update({ is_active: !current }).eq('id', id)
    fetchCoupons()
  }

  const deleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return
    await supabase.from('coupons').delete().eq('id', id)
    fetchCoupons()
  }

  const inputStyle = {
    background: '#ffffff',
    border: '1px solid rgba(135,206,235,0.5)',
    color: '#2c2c2c',
    borderRadius: '12px',
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    fontSize: '13px',
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color: '#1E90FF'}}>Manage</p>
            <h1 className="text-3xl font-black" style={{color: '#2c2c2c'}}>Coupon Codes</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 rounded-xl font-bold text-white transition hover:scale-105 sky-btn"
          >
            {showForm ? '✕ Cancel' : '➕ New Coupon'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-black mb-4" style={{color: '#2c2c2c'}}>Create New Coupon</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Coupon Code *</label>
                <input type="text" value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="e.g. SAVE500" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Type *</label>
                <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} style={inputStyle}>
                  <option value="fixed">Fixed Amount (₦)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>
                  Value * {form.type === 'fixed' ? '(₦)' : '(%)'}
                </label>
                <input type="number" value={form.value} onChange={(e) => setForm({...form, value: e.target.value})} placeholder={form.type === 'fixed' ? 'e.g. 500' : 'e.g. 10'} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Min Order (₦)</label>
                <input type="number" value={form.min_order} onChange={(e) => setForm({...form, min_order: e.target.value})} placeholder="e.g. 5000" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Max Uses</label>
                <input type="number" value={form.max_uses} onChange={(e) => setForm({...form, max_uses: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Expires At (Optional)</label>
                <input type="date" value={form.expires_at} onChange={(e) => setForm({...form, expires_at: e.target.value})} style={inputStyle} />
              </div>
            </div>
            <button onClick={handleCreate} disabled={loading} className="w-full py-3 rounded-xl font-black text-white transition hover:scale-105 disabled:opacity-40 sky-btn">
              {loading ? '⏳ Creating...' : '✅ Create Coupon'}
            </button>
          </div>
        )}

        {/* Coupons List */}
        <div className="card p-6">
          <h2 className="text-lg font-black mb-4" style={{color: '#2c2c2c'}}>All Coupons ({coupons.length})</h2>
          {coupons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-3">🎟️</p>
              <p style={{color: 'rgba(44,44,44,0.4)'}}>No coupons yet. Create your first coupon!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between p-4 rounded-xl" style={{background: 'rgba(135,206,235,0.05)', border: '1px solid rgba(135,206,235,0.2)'}}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black text-lg sky-text">{coupon.code}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{
                        background: coupon.type === 'fixed' ? 'rgba(30,144,255,0.1)' : 'rgba(52,211,153,0.1)',
                        color: coupon.type === 'fixed' ? '#1E90FF' : '#34d399'
                      }}>
                        {coupon.type === 'fixed' ? `₦${coupon.value} OFF` : `${coupon.value}% OFF`}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs" style={{color: 'rgba(44,44,44,0.5)'}}>
                      <span>Min: ₦{coupon.min_order.toLocaleString()}</span>
                      <span>Used: {coupon.used_count}/{coupon.max_uses}</span>
                      {coupon.expires_at && <span>Expires: {new Date(coupon.expires_at).toLocaleDateString('en-NG')}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => toggleCoupon(coupon.id, coupon.is_active)}
                      className="px-3 py-1 rounded-full text-xs font-bold transition"
                      style={coupon.is_active
                        ? {background: 'rgba(52,211,153,0.15)', color: '#34d399'}
                        : {background: 'rgba(248,113,113,0.15)', color: '#f87171'}
                      }
                    >
                      {coupon.is_active ? '✅ Active' : '❌ Off'}
                    </button>
                    <button onClick={() => deleteCoupon(coupon.id, coupon.code)} className="text-xs text-red-400 hover:text-red-500 font-bold">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
