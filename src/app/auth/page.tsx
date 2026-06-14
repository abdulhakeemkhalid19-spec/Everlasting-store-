'use client'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'

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
    if (!signupForm.full_name || !signupForm.email || !signupForm.password) {
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

      let referrerId = null
      if (signupForm.referral_code) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', signupForm.referral_code.toUpperCase())
          .single()
        if (referrer) referrerId = referrer.id
      }

      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const isFirst100 = (count || 0) < 100

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

      if (referrerId) {
        await supabase.from('referrals').insert({
          referrer_id: referrerId,
          referred_id: data.user.id,
        })
        await supabase.from('rewards').insert({
          user_id: referrerId,
          type: 'referral',
          amount: 500,
          description: `${signupForm.full_name} joined using your referral code`,
        })
        const { error } = await supabase.rpc('increment_reward', { user_id: referrerId, amount: 500 })
        if (error) {
          console.error('RPC error:', error)
        }
        await supabase.from('profiles').update({ reward_balance: 500 }).eq('id', referrerId)
      }

      if (isFirst100) {
        await supabase.from('rewards').insert({
          user_id: data.user.id,
          type: 'first_100',
          amount: 500,
          description: 'Welcome! You are one of the first 100 users!',
        })
      }

      setSuccess(isFirst100
        ? '🎉 Account created! You are one of the first 100 users!'
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
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f0f9ff, #ffffff)' }}>
      <nav style={{ background: '#ffffff', borderBottom: '1px solid rgba(135,206,235,0.3)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Logo size={36} />
              <div>
                <h1 className="text-lg font-black tracking-wider">EVERLASTING</h1>
                <p className="text-xs tracking-widest leading-tight">STORE</p>
              </div>
            </div>
          </Link>
          <Link href="/" className="text-sm" style={{ color: '#1E90FF' }}>← Back</Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size={60} />
            <h1 className="text-2xl font-black mt-3 sky-text">
              {tab === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(44,44,44,0.6)' }}>
              {tab === 'login' ? 'Sign in to your account' : 'Join the Everlasting family'}
            </p>
          </div>

          <div className="flex rounded-xl overflow-hidden mb-6">
            <button
              onClick={() => { setTab('login'); setError(''); setSuccess('') }}
              className="flex-1 py-3 text-sm font-bold transition-all"
              style={tab === 'login'
                ? { background: 'linear-gradient(135deg, #1E90FF, #87CEEB)', color: 'white' }
                : { background: 'white', color: 'rgba(44,44,44,0.5)' }}
            >
              Login
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); setSuccess('') }}
              className="flex-1 py-3 text-sm font-bold transition-all"
              style={tab === 'signup'
                ? { background: 'linear-gradient(135deg, #1E90FF, #87CEEB)', color: 'white' }
                : { background: 'white', color: 'rgba(44,44,44,0.5)' }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(255,0,0,0.08)' }}>
              <p className="text-xs text-red-500 text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(0,200,100,0.08)' }}>
              <p className="text-xs text-green-500 text-center">{success}</p>
            </div>
          )}

          <div className="card p-6 space-y-4">
            {tab === 'login' ? (
              <>
                <div>
                  <label className="text-xs font-bold block mb-2">Email</label>
                  <input type="email" value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    style={inputStyle} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2">Password</label>
                  <input type="password" value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={inputStyle} placeholder="••••••••" />
                </div>
                <button onClick={handleLogin} disabled={loading}
                  className="w-full py-3 text-sm font-bold rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #1E90FF, #87CEEB)' }}>
                  {loading ? '⏳ Signing in...' : '🔐 Login'}
                </button>
                <p className="text-center text-xs" style={{ color: 'rgba(44,44,44,0.6)' }}>
                  Don&apos;t have an account?{' '}
                  <button onClick={() => setTab('signup')} className="text-blue-500 font-bold">Sign Up</button>
                </p>
              </>
            ) : (
              <>
                {refCode && (
                  <div className="rounded-xl p-3" style={{ background: 'rgba(30,144,255,0.08)' }}>
                    <p className="text-xs text-green-600 font-bold">🎁 Referral code applied: {refCode}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold block mb-2">Full Name</label>
                  <input type="text" value={signupForm.full_name}
                    onChange={(e) => setSignupForm({ ...signupForm, full_name: e.target.value })}
                    style={inputStyle} placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2">Email</label>
                  <input type="email" value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    style={inputStyle} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2">Phone</label>
                  <input type="tel" value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    style={inputStyle} placeholder="+1234567890" />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2">Password</label>
                  <input type="password" value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    style={inputStyle} placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2">Confirm Password</label>
                  <input type="password" value={signupForm.confirm_password}
                    onChange={(e) => setSignupForm({ ...signupForm, confirm_password: e.target.value })}
                    style={inputStyle} placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-2">Referral Code (optional)</label>
                  <input type="text" value={signupForm.referral_code}
                    onChange={(e) => setSignupForm({ ...signupForm, referral_code: e.target.value })}
                    style={inputStyle} placeholder="Enter referral code" />
                  <p className="text-xs mt-1" style={{ color: 'rgba(44,44,44,0.5)' }}>
                    Get 500 reward points when you use a referral code!
                  </p>
                </div>
                <button onClick={handleSignup} disabled={loading}
                  className="w-full py-3 text-sm font-bold rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #1E90FF, #87CEEB)' }}>
                  {loading ? '⏳ Creating account...' : '✨ Create Account'}
                </button>
                <p className="text-center text-xs" style={{ color: 'rgba(44,44,44,0.6)' }}>
                  Already have an account?{' '}
                  <button onClick={() => setTab('login')} className="text-blue-500 font-bold">Login</button>
                </p>
              </>
            )}
          </div>

          <div className="mt-4 rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #1E90FF, #87CEEB)' }}>
            <p className="text-white font-black text-sm">🎉 First 100 Members Bonus!</p>
            <p className="text-white text-xs mt-1 opacity-80">Register now and get 500 reward points FREE</p>
          </div>
        </div>
      </div>

      <footer style={{ background: '#ffffff', borderTop: '1px solid rgba(135,206,235,0.3)' }}>
        <div className="max-w-6xl mx-auto text-center py-4">
          <p className="text-xs" style={{ color: 'rgba(44,44,44,0.5)' }}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}
