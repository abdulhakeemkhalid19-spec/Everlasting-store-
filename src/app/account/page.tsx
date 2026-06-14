'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [rewards, setRewards] = useState<any[]>([])
  const [referrals, setReferrals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
      return
    }
    setUser(user)
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (profile) setProfile(profile)
    const { data: rewards } = await supabase.from('rewards').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (rewards) setRewards(rewards)
    const { data: referrals } = await supabase.from('referrals').select('*, referred:referred_id(full_name, created_at)').eq('referrer_id', user.id)
    if (referrals) setReferrals(referrals)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const copyReferralLink = () => {
    const link = `${window.location.origin}/auth?ref=${profile?.referral_code}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferralOnWhatsApp = () => {
    const link = `${window.location.origin}/auth?ref=${profile?.referral_code}`
    const message = encodeURIComponent(
      `🛍️ Join Everlasting Store and shop premium perfumes, abayas, jalabiya and fashion!\n\n` +
      `Use my referral link to sign up and we both get rewards:\n${link}\n\n` +
      `Shop at: everlastingstore.vercel.app`
    )
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: '#fdf8f0'}}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mx-auto mb-4"></div>
          <p style={{color: '#1E90FF'}}>Loading your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{background: '#fdf8f0'}}>

      <nav style={{background: '#ffffff', borderBottom: '1px solid rgba(135,206,235,0.4)', boxShadow: '0 2px 20px rgba(135,206,235,0.15)'}} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Logo size={36} />
              <div>
                <h1 className="text-lg font-black tracking-wider sky-text leading-tight">EVERLASTING</h1>
                <p className="text-xs tracking-widest leading-tight" style={{color: 'rgba(30,144,255,0.6)'}}>STORE</p>
              </div>
            </div>
          </Link>
          <button onClick={handleLogout} className="text-sm font-bold px-4 py-2 rounded-full transition hover:scale-105" style={{background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)'}}>
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color: '#1E90FF'}}>My Account</p>
          <h1 className="text-3xl font-black" style={{color: '#2c2c2c'}}>
            Welcome, {profile?.full_name?.split(' ')[0]}! 👋
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          {/* Profile Card */}
          <div className="card p-6">
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{color: '#1E90FF'}}>👤 Profile</p>
            <div className="space-y-3">
              {[
                {label: 'Name', value: profile?.full_name},
                {label: 'Email', value: user?.email},
                {label: 'Phone', value: profile?.phone},
                {label: 'Member Since', value: new Date(profile?.created_at).toLocaleDateString('en-NG', {day: 'numeric', month: 'long', year: 'numeric'})},
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span style={{color: 'rgba(44,44,44,0.5)'}}>{item.label}</span>
                  <span className="font-semibold" style={{color: '#2c2c2c'}}>{item.value}</span>
                </div>
              ))}
              {profile?.is_first_100 && (
                <div className="mt-2 px-3 py-2 rounded-xl text-xs font-bold text-center" style={{background: 'linear-gradient(135deg, #1E90FF, #87CEEB)', color: 'white'}}>
                  🎉 You are one of the First 100 Members!
                </div>
              )}
            </div>
          </div>

          {/* Reward Balance */}
          <div className="card p-6" style={{background: 'linear-gradient(135deg, #e8f4fd, #ffffff)'}}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{color: '#1E90FF'}}>💰 Reward Balance</p>
            <div className="text-center py-4">
              <p className="text-5xl font-black sky-text mb-2">₦{(profile?.reward_balance || 0).toLocaleString()}</p>
              <p className="text-xs" style={{color: 'rgba(44,44,44,0.5)'}}>Available rewards balance</p>
              <p className="text-xs mt-2" style={{color: 'rgba(44,44,44,0.4)'}}>Mention your reward balance when ordering on WhatsApp to apply discount!</p>
            </div>
          </div>

        </div>

        {/* Referral Section */}
        <div className="card p-6 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{color: '#1E90FF'}}>🎁 Referral Program</p>
          <p className="text-sm mb-4" style={{color: 'rgba(44,44,44,0.6)'}}>
            Share your referral link with friends. When they sign up using your link, you both get <strong>₦500 reward!</strong>
          </p>

          <div className="rounded-xl p-4 mb-4" style={{background: 'rgba(135,206,235,0.1)', border: '1px solid rgba(135,206,235,0.3)'}}>
            <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{color: '#1E90FF'}}>Your Referral Code</p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-black sky-text flex-1">{profile?.referral_code}</p>
              <button
                onClick={copyReferralLink}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:scale-105 sky-btn"
              >
                {copied ? '✅ Copied!' : '📋 Copy Link'}
              </button>
            </div>
            <p className="text-xs mt-2" style={{color: 'rgba(44,44,44,0.4)'}}>
              Link: {typeof window !== 'undefined' ? window.location.origin : ''}/auth?ref={profile?.referral_code}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={shareReferralOnWhatsApp}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition hover:scale-105 flex items-center justify-center gap-2"
              style={{background: 'linear-gradient(135deg, #25d366, #128c7e)'}}
            >
              📱 Share on WhatsApp
            </button>
            <button
              onClick={copyReferralLink}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition hover:scale-105"
              style={{background: 'rgba(135,206,235,0.15)', border: '1px solid rgba(135,206,235,0.4)', color: '#1E90FF'}}
            >
              {copied ? '✅ Copied!' : '📋 Copy Link'}
            </button>
          </div>

          {referrals.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color: '#2c2c2c'}}>
                People You Referred ({referrals.length})
              </p>
              <div className="space-y-2">
                {referrals.map((ref) => (
                  <div key={ref.id} className="flex items-center justify-between p-3 rounded-xl" style={{background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)'}}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{background: 'linear-gradient(135deg, #34d399, #059669)'}}>
                        {ref.referred?.full_name?.charAt(0) || '?'}
                      </div>
                      <p className="text-sm font-semibold" style={{color: '#2c2c2c'}}>{ref.referred?.full_name}</p>
                    </div>
                    <span className="text-xs font-bold" style={{color: '#34d399'}}>+₦500</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rewards History */}
        <div className="card p-6 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{color: '#1E90FF'}}>🏆 Rewards History</p>
          {rewards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🎁</p>
              <p className="text-sm" style={{color: 'rgba(44,44,44,0.4)'}}>No rewards yet. Refer friends to earn rewards!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3 rounded-xl" style={{background: 'rgba(135,206,235,0.08)', border: '1px solid rgba(135,206,235,0.15)'}}>
                  <div>
                    <p className="text-sm font-semibold" style={{color: '#2c2c2c'}}>{reward.description}</p>
                    <p className="text-xs" style={{color: 'rgba(44,44,44,0.4)'}}>{new Date(reward.created_at).toLocaleDateString('en-NG')}</p>
                  </div>
                  <span className="text-base font-black" style={{color: '#34d399'}}>+₦{reward.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {href: '/shop', icon: '🛍️', label: 'Shop Now'},
            {href: '/cart', icon: '🛒', label: 'My Cart'},
            {href: '/faq', icon: '❓', label: 'FAQ'},
            {href: '/', icon: '🏠', label: 'Home'},
          ].map((link) => (
            <Link key={link.href} href={link.href} className="card p-4 text-center group hover:scale-105 transition-transform">
              <p className="text-3xl mb-2 group-hover:scale-110 transition-transform">{link.icon}</p>
              <p className="text-sm font-bold" style={{color: '#1E90FF'}}>{link.label}</p>
            </Link>
          ))}
        </div>

      </div>

      <footer style={{background: '#ffffff', borderTop: '1px solid rgba(135,206,235,0.3)'}} className="py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-3"><Logo size={40} /></div>
          <h2 className="text-2xl font-black mb-1 sky-text">EVERLASTING STORE</h2>
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
