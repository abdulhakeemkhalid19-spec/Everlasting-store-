'use client'

const reviews = [
  {
    id: 1,
    name: 'Aisha Bello',
    location: 'Lagos',
    rating: 5,
    review: 'I ordered an abaya and it arrived so fast! The quality is amazing, exactly as shown in the picture. Will definitely order again!',
    product: 'Black Embroidered Abaya',
    avatar: 'A',
  },
  {
    id: 2,
    name: 'Fatimah Yusuf',
    location: 'Ibadan',
    rating: 5,
    review: 'The perfume smells absolutely divine! Got so many compliments at work. The packaging was also very neat and professional.',
    product: 'Oud Al Shams Perfume',
    avatar: 'F',
  },
  {
    id: 3,
    name: 'Olaniyi Abdulmalik',
    location: 'Ibadan',
    rating: 5,
    review: 'Very trustworthy store! I was sceptical at first but the slides I ordered are exactly what I wanted. Fast delivery too!',
    product: 'Nike Slides',
    avatar: 'K',
  },
  {
    id: 4,
    name: 'Umm Khalid',
    location: 'Kano',
    rating: 5,
    review: 'Masha Allah! The jalabiya fabric is so soft and comfortable. My husband loves it. Already recommended to my sisters!',
    product: 'White Cotton Jalabiya',
    avatar: 'U',
  },
  {
    id: 5,
    name: 'Maryam Ibrahim',
    location: 'Kaduna',
    rating: 5,
    review: 'Best online fashion store in Nigeria! Affordable prices and top quality. The WhatsApp ordering is so easy and convenient.',
    product: 'Ladies Fashion',
    avatar: 'M',
  },
  {
    id: 6,
    name: 'Akinyemi Abdullah',
    location: 'Oyo',
    rating: 4,
    review: 'Very good products and fast response on WhatsApp. The abaya fits perfectly. Only thing is I wish there were more colour options!',
    product: 'Printed Abaya',
    avatar: 'H',
  },
]

export default function Testimonials() {
  return (
    <div className="py-16 px-4" style={{background: '#fdf8f0'}}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{color: '#1E90FF'}}>
            What Customers Say
          </p>
          <h2 className="text-3xl font-black mb-2" style={{color: '#2c2c2c'}}>
            Customer Reviews
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className="text-xl" style={{color: '#f59e0b'}}>★</span>
            ))}
            <span className="ml-2 text-sm font-bold" style={{color: '#2c2c2c'}}>4.9/5</span>
          </div>
          <p className="text-xs" style={{color: 'rgba(44,44,44,0.5)'}}>Based on {reviews.length}+ verified reviews</p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-5"
              style={{border: '1px solid rgba(135,206,235,0.25)', boxShadow: '0 4px 15px rgba(135,206,235,0.1)'}}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} style={{color: s <= review.rating ? '#f59e0b' : '#e0e0e0', fontSize: '14px'}}>★</span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm leading-relaxed mb-4" style={{color: 'rgba(44,44,44,0.7)'}}>
                "{review.review}"
              </p>

              {/* Product */}
              <p className="text-xs mb-4 px-2 py-1 rounded-full inline-block" style={{background: 'rgba(135,206,235,0.15)', color: '#1E90FF'}}>
                ✓ Bought: {review.product}
              </p>

              {/* Customer */}
              <div className="flex items-center gap-3 pt-3" style={{borderTop: '1px solid rgba(135,206,235,0.2)'}}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white shrink-0"
                  style={{background: 'linear-gradient(135deg, #1E90FF, #87CEEB)'}}
                >
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{color: '#2c2c2c'}}>{review.name}</p>
                  <p className="text-xs" style={{color: 'rgba(44,44,44,0.4)'}}>📍 {review.location}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs px-2 py-1 rounded-full font-bold" style={{background: 'rgba(52,211,153,0.15)', color: '#34d399'}}>
                    ✓ Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
