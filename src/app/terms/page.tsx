import Link from 'next/link'
import Logo from '@/components/Logo'

export default function TermsPage() {
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
          <h1 className="text-4xl font-black mb-2" style={{color: '#2c2c2c'}}>Terms & <span className="sky-text">Conditions</span></h1>
          <p className="text-sm" style={{color: 'rgba(44,44,44,0.5)'}}>Last updated: January 2024</p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing and using Everlasting Store (everlastingstore.vercel.app), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.'
            },
            {
              title: '2. Products and Pricing',
              content: 'All products listed on our website are subject to availability. Prices are listed in Nigerian Naira (₦) and are subject to change without notice. We reserve the right to cancel any order if a pricing error occurs. Product images are for illustration purposes and may vary slightly from the actual product.'
            },
            {
              title: '3. Ordering Process',
              content: 'Orders are placed by adding items to your cart and sending the order via WhatsApp. An order is only confirmed after we receive your payment. We reserve the right to refuse or cancel any order at our discretion.'
            },
            {
              title: '4. Payment',
              content: 'We accept payment via bank transfer only. Payment details will be sent to you on WhatsApp after you place your order. Orders will only be processed and dispatched after payment is confirmed. We do not accept cash on delivery at this time.'
            },
            {
              title: '5. Delivery',
              content: 'We offer same day delivery within Ibadan and 2-5 business days for other states in Nigeria. Delivery times are estimates and may vary depending on location and circumstances beyond our control. We are not responsible for delays caused by courier services.'
            },
            {
              title: '6. Returns and Refunds',
              content: 'We accept returns within 3 days of delivery for items that are damaged, defective or not as described. Items must be in their original condition and packaging. Refunds will be processed within 3-5 business days after we receive the returned item. We do not accept returns for perfumes that have been opened or used.'
            },
            {
              title: '7. Product Quality',
              content: 'We guarantee that all products sold on Everlasting Store are authentic and of high quality. If you receive a product that does not meet our quality standards, please contact us immediately with photos via WhatsApp.'
            },
            {
              title: '8. Intellectual Property',
              content: 'All content on this website including logos, images, text and design is the property of Everlasting Store. You may not reproduce, distribute or use any content from this website without our express written permission.'
            },
            {
              title: '9. Limitation of Liability',
              content: 'Everlasting Store shall not be liable for any indirect, incidental or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the specific product or service in question.'
            },
            {
              title: '10. Changes to Terms',
              content: 'We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of our website after changes are posted constitutes your acceptance of the new terms.'
            },
            {
              title: '11. Governing Law',
              content: 'These Terms and Conditions are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of Nigerian courts.'
            },
            {
              title: '12. Contact',
              content: 'For questions about these Terms and Conditions, contact us via WhatsApp on 07041304966 or visit everlastingstore.vercel.app.'
            },
          ].map((section) => (
            <div key={section.title} className="card p-6">
              <h2 className="text-lg font-black mb-3" style={{color: '#1E90FF'}}>{section.title}</h2>
              <p className="text-sm leading-relaxed" style={{color: 'rgba(44,44,44,0.7)'}}>{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/privacy" className="text-sm font-bold mr-6" style={{color: '#1E90FF'}}>Privacy Policy →</Link>
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
