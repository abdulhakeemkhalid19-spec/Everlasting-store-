import Link from 'next/link'
import Logo from '@/components/Logo'

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{background: '#fdf8f0'}}>

      {/* Navbar */}
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
          <Link href="/shop" className="text-sm font-medium" style={{color: '#1E90FF'}}>
            ← Back to Shop
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo size={80} />
          </div>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{color: '#1E90FF'}}>Our Story</p>
          <h1 className="text-4xl font-black mb-4 sky-text">About Everlasting Store</h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{color: 'rgba(44,44,44,0.6)'}}>
            Your trusted online destination for premium perfumes, abayas, jalabiya, slides and fashion across Nigeria.
          </p>
        </div>

        {/* Story */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-black mb-4" style={{color: '#2c2c2c'}}>Who We Are</h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{color: 'rgba(44,44,44,0.7)'}}>
            <p>
              Everlasting Store is a premium online fashion and perfume store dedicated to bringing you the finest quality products at affordable prices. We believe every Nigerian deserves access to beautiful, high-quality fashion without having to travel far or pay too much.
            </p>
            <p>
              We specialize in authentic perfumes, elegant abayas, stylish jalabiya, comfortable slides and footwear, and a wide range of ladies and mens fashion. Every product in our store is carefully selected to meet our high standards of quality.
            </p>
            <p>
              Our ordering process is simple and convenient — browse our store, add your favourite items to cart, and send your order directly to our WhatsApp. We handle the rest and deliver right to your doorstep anywhere in Nigeria!
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {icon: '💎', title: 'Quality First', desc: 'Every product is carefully selected for quality and authenticity before being listed on our store.'},
            {icon: '🚚', title: 'Fast Delivery', desc: 'Same day delivery in Ibadan. 2-5 days delivery to all other states across Nigeria.'},
            {icon: '💬', title: 'Easy Ordering', desc: 'Simply browse, add to cart and send your order to our WhatsApp. No complicated checkout process.'},
          ].map((val) => (
            <div key={val.title} className="card p-6 text-center">
              <p className="text-4xl mb-3">{val.icon}</p>
              <h3 className="font-black mb-2" style={{color: '#2c2c2c'}}>{val.title}</h3>
              <p className="text-xs leading-relaxed" style={{color: 'rgba(44,44,44,0.6)'}}>{val.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-black mb-6" style={{color: '#2c2c2c'}}>Why Choose Everlasting Store?</h2>
          <div className="space-y-4">
            {[
              {icon: '✅', text: '100% authentic and quality-assured products'},
              {icon: '✅', text: 'Affordable prices with regular discounts and offers'},
              {icon: '✅', text: 'Fast and reliable delivery nationwide'},
              {icon: '✅', text: 'Easy WhatsApp ordering — no account needed'},
              {icon: '✅', text: 'Friendly and responsive customer service'},
              {icon: '✅', text: 'Wide variety of perfumes, abayas, jalabiya and fashion'},
              {icon: '✅', text: 'Secure bank transfer payment after confirmation'},
              {icon: '✅', text: 'New arrivals added every week'},
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg shrink-0">{item.icon}</span>
                <p className="text-sm" style={{color: 'rgba(44,44,44,0.7)'}}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="card p-8 mb-8" style={{background: 'linear-gradient(135deg, #e8f4fd, #ffffff)'}}>
          <h2 className="text-2xl font-black mb-6" style={{color: '#2c2c2c'}}>Contact Us</h2>
          <div className="space-y-4">
            {[
              {icon: '📱', label: 'WhatsApp', value: '07041304966', href: 'https://wa.me/2347041304966'},
              {icon: '🌍', label: 'Location', value: 'Online Store — We deliver nationwide across Nigeria', href: null},
              {icon: '🕐', label: 'Business Hours', value: 'Monday - Saturday: 8am - 9pm', href: null},
              {icon: '🚚', label: 'Delivery', value: 'Same day Ibadan | 2-5 days other states', href: null},
            ].map((contact) => (
              <div key={contact.label} className="flex items-center gap-4 p-4 rounded-xl" style={{background: 'rgba(135,206,235,0.1)'}}>
                <span className="text-2xl shrink-0">{contact.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{color: '#1E90FF'}}>{contact.label}</p>
                  {contact.href ? (
                    <a href={contact.href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:text-blue-500 transition" style={{color: '#2c2c2c'}}>
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-sm" style={{color: 'rgba(44,44,44,0.7)'}}>{contact.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-black mb-4" style={{color: '#2c2c2c'}}>Ready to Shop?</h3>
          <p className="mb-6" style={{color: 'rgba(44,44,44,0.6)'}}>Browse our collection of premium products!</p>
          <Link href="/shop" className="px-10 py-4 rounded-full font-black text-white transition-all hover:scale-105 inline-block sky-btn">
            Shop Now →
          </Link>
        </div>

      </div>

      {/* Footer */}
      <footer style={{background: '#ffffff', borderTop: '1px solid rgba(135,206,235,0.3)'}} className="py-12 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-3">
            <Logo size={40} />
          </div>
          <h2 className="text-2xl font-black mb-1 sky-text">EVERLASTING STORE</h2>
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.2)'}}>© 2024 Everlasting Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
