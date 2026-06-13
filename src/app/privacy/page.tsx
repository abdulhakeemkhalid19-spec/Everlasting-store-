import Link from 'next/link'
import Logo from '@/components/Logo'

export default function PrivacyPage() {
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
          <Link href="/" className="text-sm font-medium" style={{color: '#1E90FF'}}>← Home</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{color: '#1E90FF'}}>Legal</p>
          <h1 className="text-4xl font-black mb-2" style={{color: '#2c2c2c'}}>Privacy <span className="sky-text">Policy</span></h1>
          <p className="text-sm" style={{color: 'rgba(44,44,44,0.5)'}}>Last updated: January 2024</p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: '1. Information We Collect',
              content: 'When you place an order through Everlasting Store, we collect your name, phone number, delivery address and order details. This information is shared with us via WhatsApp when you submit your order. We do not collect payment card details as all payments are made via bank transfer.'
            },
            {
              title: '2. How We Use Your Information',
              content: 'We use your personal information solely to process and deliver your orders, communicate with you about your orders, and improve our service. We do not sell, rent or share your personal information with third parties for marketing purposes.'
            },
            {
              title: '3. WhatsApp Communication',
              content: 'By sending your order to our WhatsApp number, you consent to us saving your contact details for order processing and future communication about your orders. We may send you updates about your order status via WhatsApp.'
            },
            {
              title: '4. Cookies',
              content: 'We use cookies to improve your browsing experience on our website. Cookies help us remember your cart items and preferences. You can choose to disable cookies in your browser settings, but this may affect some features of our website.'
            },
            {
              title: '5. Data Security',
              content: 'We take reasonable measures to protect your personal information. However, no method of transmission over the internet is 100% secure. We recommend you do not share sensitive personal information beyond what is necessary for your order.'
            },
            {
              title: '6. Your Rights',
              content: 'You have the right to request access to the personal information we hold about you, request correction of any inaccurate information, and request deletion of your personal data. To exercise these rights, contact us via WhatsApp on 07041304966.'
            },
            {
              title: '7. Changes to This Policy',
              content: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this policy periodically.'
            },
            {
              title: '8. Contact Us',
              content: 'If you have any questions about this Privacy Policy, please contact us via WhatsApp on 07041304966 or visit our website at everlastingstore.vercel.app.'
            },
          ].map((section) => (
            <div key={section.title} className="card p-6">
              <h2 className="text-lg font-black mb-3" style={{color: '#1E90FF'}}>{section.title}</h2>
              <p className="text-sm leading-relaxed" style={{color: 'rgba(44,44,44,0.7)'}}>{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/terms" className="text-sm font-bold mr-6" style={{color: '#1E90FF'}}>Terms & Conditions →</Link>
          <Link href="/" className="text-sm font-bold" style={{color: '#1E90FF'}}>Back to Store →</Link>
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
