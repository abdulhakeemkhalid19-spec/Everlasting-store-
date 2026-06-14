'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'
import { Suspense } from 'react'

function generateReferralCode(name: string): string {
  const clean = name.replace(/\s+/g, '').toUpperCase().slice(0, 4)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${clean}${random}`
}

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refCode = searchParams.get('ref') || ''

  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    referral_code: refCode,
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) router.push('/account')
  }

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields!')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    })
    if (error) {
      setError(error.message)
    } else {
      router.push('/account')
    }
    setLoading(false)
  }

  const handleSignup = async () => {
    if (!signupForm.full_name || !signupForm.email || !signupForm.phone || !signupForm.password) {
      setError('Please fill in all fields!')
      return
    }
    if (signupForm.password !== signupForm.confirm_password) {
      setError('Passwords do not match!')
      return
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters!')
      return
    }
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email: signupForm.email,
      password: signupForm.password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const referralCode = generateReferralCode(signupForm.full_name)

      // Check if referral code is valid
      let referrerId = null
      if (signupForm.referral_code) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', signupForm.referral_code.toUpperCase())
          .single()
        if (referrer) referrerId = referrer.id
      }

      // Count total users to check if first 100
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const isFirst100 = (count || 0) < 100

      // Create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: signupForm.full_name,
        email: signupForm.email,
        phone: signupForm.phone,
        referral_code: referralCode,
        referred_by: signupForm.referral_code || null,
        reward_balance: isFirst100 ? 500 : 0,
        is_first_100: isFirst100,
      })

      // Give referral reward to referrer
      if (referrerId) {
        await supabase.from('referrals').insert({
          referrer_id: referrerId,
          referred_id: data.user.id,
        })
        await supabase.from('rewards').insert({
          user_id: referrerId,
          type: 'referral',
          amount: 500,
          description: `${signupForm.full_name} joined using your referral code!`,
        })
          const { error } = await supabase.rpc('increment_reward', { ... })
            if (error) {
              // handle error
            }
          supabase.from('profiles').update({ reward_balance: 500 }).eq('id', referrerId)
        })
      }

      // Give first 100 reward
      if (isFirst100) {
        await supabase.from('rewards').insert({
          user_id: data.user.id,
          type: 'first_100',
          amount: 500,
          description: 'Welcome! You are one of the first 100 users — ₦500 reward added!',
        })
      }

      setSuccess(isFirst100
        ? '🎉 Account created! You are one of the first 100 users — ₦500 reward added to your account!'
        : '✅ Account created successfully! Please check your email to verify.'
      )
    }
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

  return (
    <div className="min-h-screen flex flex-col" style={{background: '#fdf8f0'}}>

      <nav style={{background: '#ffffff', borderBottom: '1px solid rgba(135,206,235,0.4)', boxShadow: '0 2px 20px rgba(135,206,235,0.15)'}}>
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
          <Link href="/" className="text-sm" style={{color: '#1E90FF'}}>← Back to Store</Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <Logo size={60} />
            <h1 className="text-2xl font-black mt-3 sky-text">
              {tab === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="text-sm mt-1" style={{color: 'rgba(44,44,44,0.5)'}}>
              {tab === 'login' ? 'Sign in to your account' : 'Join Everlasting Store today'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden mb-6" style={{border: '1px solid rgba(135,206,235,0.3)'}}>
            <button
              onClick={() => { setTab('login'); setError(''); setSuccess('') }}
              className="flex-1 py-3 text-sm font-bold transition-all"
              style={tab === 'login'
                ? {background: 'linear-gradient(135deg, #1E90FF, #87CEEB)', color: 'white'}
                : {background: 'white', color: 'rgba(44,44,44,0.5)'}
              }
            >
              Login
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); setSuccess('') }}
              className="flex-1 py-3 text-sm font-bold transition-all"
              style={tab === 'signup'
                ? {background: 'linear-gradient(135deg, #1E90FF, #87CEEB)', color: 'white'}
                : {background: 'white', color: 'rgba(44,44,44,0.5)'}
              }
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="rounded-xl p-3 mb-4" style={{background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)'}}>
              <p className="text-xs text-red-500 text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl p-3 mb-4" style={{background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)'}}>
              <p className="text-xs text-green-500 text-center">{success}</p>
            </div>
          )}

          <div className="card p-6 space-y-4">

            {tab === 'login' ? (
              <>
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Email</label>
                  <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} placeholder="your@email.com" style={inputStyle} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Password</label>
                  <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} placeholder="Enter password" style={inputStyle} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                </div>
                <button onClick={handleLogin} disabled={loading} className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:scale-105 disabled:opacity-40 sky-btn">
                  {loading ? '⏳ Signing in...' : '🔐 Login'}
                </button>
                <p className="text-center text-xs" style={{color: 'rgba(44,44,44,0.5)'}}>
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setTab('signup')} className="font-bold" style={{color: '#1E90FF'}}>Sign up here</button>
                </p>
              </>
            ) : (
              <>
                {refCode && (
                  <div className="rounded-xl p-3" style={{background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)'}}>
                    <p className="text-xs text-green-600 font-bold text-center">🎉 You were referred! Sign up to get your reward!</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Full Name *</label>
                  <input type="text" value={signupForm.full_name} onChange={(e) => setSignupForm({...signupForm, full_name: e.target.value})} placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Email *</label>
                  <input type="email" value={signupForm.email} onChange={(e) => setSignupForm({...signupForm, email: e.target.value})} placeholder="your@email.com" style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Phone Number *</label>
                  <input type="tel" value={signupForm.phone} onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})} placeholder="08012345678" style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Password *</label>
                  <input type="password" value={signupForm.password} onChange={(e) => setSignupForm({...signupForm, password: e.target.value})} placeholder="Min 6 characters" style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Confirm Password *</label>
                  <input type="password" value={signupForm.confirm_password} onChange={(e) => setSignupForm({...signupForm, confirm_password: e.target.value})} placeholder="Repeat password" style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2 uppercase tracking-wider" style={{color: '#2c2c2c'}}>Referral Code (Optional)</label>
                  <input type="text" value={signupForm.referral_code} onChange={(e) => setSignupForm({...signupForm, referral_code: e.target.value.toUpperCase()})} placeholder="Enter referral code" style={inputStyle} />
                  <p className="text-xs mt-1" style={{color: 'rgba(44,44,44,0.4)'}}>Have a referral code? Enter it to get your reward!</p>
                </div>
                <button onClick={handleSignup} disabled={loading} className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:scale-105 disabled:opacity-40 sky-btn">
                  {loading ? '⏳ Creating account...' : '✨ Create Account'}
                </button>
                <p className="text-center text-xs" style={{color: 'rgba(44,44,44,0.5)'}}>
                  Already have an account?{' '}
                  <button onClick={() => setTab('login')} className="font-bold" style={{color: '#1E90FF'}}>Login here</button>
                </p>
              </>
            )}
          </div>

          {/* First 100 banner */}
          <div className="mt-4 rounded-xl p-4 text-center" style={{background: 'linear-gradient(135deg, #1E90FF, #87CEEB)'}}>
            <p className="text-white font-black text-sm">🎉 First 100 users get ₦500 reward!</p>
            <p className="text-white text-xs mt-1 opacity-80">Register now before slots run out!</p>
          </div>

        </div>
      </div>

      <footer style={{background: '#ffffff', borderTop: '1px solid rgba(135,206,235,0.3)'}} className="py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{background: '#fdf8f0'}}><p style={{color: '#1E90FF'}}>Loading...</p></div>}>
      <AuthContent />
    </Suspense>
  )
}
