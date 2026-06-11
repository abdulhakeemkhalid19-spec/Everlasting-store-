'use client'
import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Placing an order is very easy! Simply browse our store, click on any product you like and tap "Add to Cart". Once you have added all your items, go to your cart, fill in your name, phone number and delivery address, then click "Send Order to WhatsApp". Your order details will be sent directly to our WhatsApp and we will confirm it immediately!',
  },
  {
    question: 'How long does delivery take?',
    answer: 'We offer same day delivery within Ibadan. For other states across Nigeria, delivery takes 2-5 business days depending on your location. We use reliable courier services to ensure your items arrive safely and on time.',
  },
  {
    question: 'How do I pay for my order?',
    answer: 'After you send your order via WhatsApp, we will confirm the items and send you our bank account details for payment. We accept bank transfers from all Nigerian banks. Once payment is confirmed, we process and dispatch your order immediately.',
  },
  {
    question: 'Are your products original and authentic?',
    answer: 'Yes absolutely! All our products are 100% original and authentic. We carefully source our perfumes, abayas, jalabiya and fashion items from trusted suppliers. Quality is our top priority and we would never sell fake or substandard products.',
  },
  {
    question: 'Can I return or exchange an item?',
    answer: 'Yes we accept returns and exchanges within 3 days of receiving your order, provided the item is in its original condition and has not been used or washed. Please contact us on WhatsApp with photos of the item and we will guide you through the process.',
  },
  {
    question: 'What sizes do you have available?',
    answer: 'We stock sizes from XS to XXXL for most of our clothing items including abayas and jalabiya. Check our Size Guide page for detailed measurements. If you are unsure about your size, feel free to message us on WhatsApp and we will help you find the perfect fit!',
  },
  {
    question: 'Do you deliver outside Nigeria?',
    answer: 'Currently we only deliver within Nigeria. We deliver to all 36 states including FCT Abuja. We are working on expanding our services internationally in the future.',
  },
  {
    question: 'What if my item arrives damaged?',
    answer: 'If your item arrives damaged or not as described, please take photos immediately and contact us on WhatsApp within 24 hours of receiving it. We will arrange a replacement or full refund as quickly as possible.',
  },
  {
    question: 'How do I know my order has been confirmed?',
    answer: 'After sending your order on WhatsApp, our team will reply to confirm your order details, total amount and payment information within a few minutes during business hours (8am - 9pm Monday to Saturday).',
  },
  {
    question: 'Can I order multiple items at once?',
    answer: 'Yes of course! You can add as many items as you want to your cart before sending your order. There is no limit on the number of items you can order at once.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{color: '#1E90FF'}}>Help Center</p>
          <h1 className="text-4xl font-black mb-4" style={{color: '#2c2c2c'}}>
            Frequently Asked <span className="sky-text">Questions</span>
          </h1>
          <p className="text-base" style={{color: 'rgba(44,44,44,0.6)'}}>
            Find answers to the most common questions about Everlasting Store
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden transition-all"
              style={{border: openIndex === index ? '1px solid rgba(135,206,235,0.6)' : '1px solid rgba(135,206,235,0.2)', boxShadow: openIndex === index ? '0 4px 20px rgba(135,206,235,0.15)' : 'none'}}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left transition-all"
                style={{background: openIndex === index ? 'rgba(135,206,235,0.08)' : 'transparent'}}
              >
                <span className="font-bold text-sm pr-4" style={{color: '#2c2c2c'}}>
                  {faq.question}
                </span>
                <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-white text-sm" style={{background: openIndex === index ? '#1E90FF' : 'rgba(135,206,235,0.3)', color: openIndex === index ? 'white' : '#1E90FF'}}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed" style={{color: 'rgba(44,44,44,0.7)'}}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="card p-8 text-center" style={{background: 'linear-gradient(135deg, #e8f4fd, #ffffff)'}}>
          <p className="text-3xl mb-3">💬</p>
          <h3 className="text-xl font-black mb-2" style={{color: '#2c2c2c'}}>Still have questions?</h3>
          <p className="text-sm mb-6" style={{color: 'rgba(44,44,44,0.6)'}}>
            Our team is always ready to help! Send us a message on WhatsApp and we will respond within minutes.
          </p>
          <a
            href="https://wa.me/2347041304966?text=Hello! I have a question about Everlasting Store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-white transition-all hover:scale-105"
            style={{background: 'linear-gradient(135deg, #25d366, #128c7e)', boxShadow: '0 8px 30px rgba(37,211,102,0.3)'}}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
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
