import Link from 'next/link'
import Logo from '@/components/Logo'

export default function SizeGuidePage() {
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

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{color: '#1E90FF'}}>Find Your Perfect Fit</p>
          <h1 className="text-4xl font-black mb-4" style={{color: '#2c2c2c'}}>
            Size <span className="sky-text">Guide</span>
          </h1>
          <p className="text-base" style={{color: 'rgba(44,44,44,0.6)'}}>
            Use this guide to find your perfect size. When in doubt, message us on WhatsApp!
          </p>
        </div>

        {/* How to Measure */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-black mb-4" style={{color: '#2c2c2c'}}>📏 How to Take Your Measurements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {icon: '👕', title: 'Chest/Bust', desc: 'Measure around the fullest part of your chest, keeping the tape parallel to the floor.'},
              {icon: '⬜', title: 'Waist', desc: 'Measure around your natural waistline, at the narrowest part of your torso.'},
              {icon: '🔵', title: 'Hips', desc: 'Measure around the fullest part of your hips, about 8 inches below your waistline.'},
              {icon: '📐', title: 'Length', desc: 'Measure from the top of your shoulder down to where you want the garment to end.'},
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl" style={{background: 'rgba(135,206,235,0.08)'}}>
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <p className="font-bold text-sm mb-1" style={{color: '#2c2c2c'}}>{item.title}</p>
                  <p className="text-xs" style={{color: 'rgba(44,44,44,0.6)'}}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Abaya Size Chart */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-black mb-2" style={{color: '#2c2c2c'}}>👘 Abaya Size Chart</h2>
          <p className="text-xs mb-4" style={{color: 'rgba(44,44,44,0.5)'}}>All measurements in centimeters (cm)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{background: 'linear-gradient(135deg, #1E90FF, #87CEEB)'}}>
                  {['Size', 'Chest', 'Waist', 'Hips', 'Length', 'Shoulder'].map((h) => (
                    <th key={h} className="py-3 px-3 text-left text-xs font-black text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {size: 'XS (52)', chest: '88-92', waist: '72-76', hips: '92-96', length: '140-145', shoulder: '36-37'},
                  {size: 'S (54)', chest: '92-96', waist: '76-80', hips: '96-100', length: '143-148', shoulder: '37-38'},
                  {size: 'M (56)', chest: '96-100', waist: '80-84', hips: '100-104', length: '146-151', shoulder: '38-39'},
                  {size: 'L (58)', chest: '100-104', waist: '84-88', hips: '104-108', length: '149-154', shoulder: '39-40'},
                  {size: 'XL (60)', chest: '104-108', waist: '88-92', hips: '108-112', length: '152-157', shoulder: '40-41'},
                  {size: 'XXL (62)', chest: '108-114', waist: '92-98', hips: '112-118', length: '155-160', shoulder: '41-43'},
                  {size: 'XXXL (64)', chest: '114-120', waist: '98-104', hips: '118-124', length: '158-163', shoulder: '43-45'},
                ].map((row, i) => (
                  <tr key={row.size} style={{background: i % 2 === 0 ? 'rgba(135,206,235,0.05)' : 'white', borderBottom: '1px solid rgba(135,206,235,0.15)'}}>
                    <td className="py-3 px-3 font-black text-xs" style={{color: '#1E90FF'}}>{row.size}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.chest}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.waist}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.hips}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.length}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jalabiya Size Chart */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-black mb-2" style={{color: '#2c2c2c'}}>👗 Jalabiya Size Chart (Men)</h2>
          <p className="text-xs mb-4" style={{color: 'rgba(44,44,44,0.5)'}}>All measurements in centimeters (cm)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{background: 'linear-gradient(135deg, #1E90FF, #87CEEB)'}}>
                  {['Size', 'Chest', 'Shoulder', 'Length', 'Sleeve'].map((h) => (
                    <th key={h} className="py-3 px-3 text-left text-xs font-black text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {size: 'S', chest: '96-100', shoulder: '44-45', length: '130-135', sleeve: '60-62'},
                  {size: 'M', chest: '100-104', shoulder: '45-46', length: '133-138', sleeve: '62-64'},
                  {size: 'L', chest: '104-108', shoulder: '46-47', length: '136-141', sleeve: '64-66'},
                  {size: 'XL', chest: '108-114', shoulder: '47-49', length: '139-144', sleeve: '66-68'},
                  {size: 'XXL', chest: '114-120', shoulder: '49-51', length: '142-147', sleeve: '68-70'},
                  {size: 'XXXL', chest: '120-126', shoulder: '51-53', length: '145-150', sleeve: '70-72'},
                ].map((row, i) => (
                  <tr key={row.size} style={{background: i % 2 === 0 ? 'rgba(135,206,235,0.05)' : 'white', borderBottom: '1px solid rgba(135,206,235,0.15)'}}>
                    <td className="py-3 px-3 font-black text-xs" style={{color: '#1E90FF'}}>{row.size}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.chest}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.shoulder}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.length}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slides Size Chart */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-black mb-2" style={{color: '#2c2c2c'}}>👡 Slides & Footwear Size Chart</h2>
          <p className="text-xs mb-4" style={{color: 'rgba(44,44,44,0.5)'}}>Nigerian sizes with EU and UK equivalents</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{background: 'linear-gradient(135deg, #1E90FF, #87CEEB)'}}>
                  {['NG Size', 'EU Size', 'UK Size', 'Foot Length (cm)'].map((h) => (
                    <th key={h} className="py-3 px-3 text-left text-xs font-black text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {ng: '36', eu: '36', uk: '3', foot: '22.5'},
                  {ng: '37', eu: '37', uk: '4', foot: '23.0'},
                  {ng: '38', eu: '38', uk: '5', foot: '23.5'},
                  {ng: '39', eu: '39', uk: '6', foot: '24.5'},
                  {ng: '40', eu: '40', uk: '7', foot: '25.0'},
                  {ng: '41', eu: '41', uk: '8', foot: '25.5'},
                  {ng: '42', eu: '42', uk: '9', foot: '26.5'},
                  {ng: '43', eu: '43', uk: '10', foot: '27.0'},
                  {ng: '44', eu: '44', uk: '11', foot: '27.5'},
                  {ng: '45', eu: '45', uk: '12', foot: '28.5'},
                ].map((row, i) => (
                  <tr key={row.ng} style={{background: i % 2 === 0 ? 'rgba(135,206,235,0.05)' : 'white', borderBottom: '1px solid rgba(135,206,235,0.15)'}}>
                    <td className="py-3 px-3 font-black text-xs" style={{color: '#1E90FF'}}>{row.ng}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.eu}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.uk}</td>
                    <td className="py-3 px-3 text-xs" style={{color: '#2c2c2c'}}>{row.foot} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips */}
        <div className="card p-6 mb-8" style={{background: 'linear-gradient(135deg, rgba(135,206,235,0.1), rgba(30,144,255,0.05))'}}>
          <h2 className="text-xl font-black mb-4" style={{color: '#2c2c2c'}}>💡 Sizing Tips</h2>
          <div className="space-y-3">
            {[
              'If you are between two sizes, we recommend sizing up for more comfort.',
              'For abayas, consider your height. If you are above 170cm, go one size up for the right length.',
              'For jalabiya, measure your chest and add 10-15cm for a comfortable fit.',
              'For slides, if your foot measurement falls between sizes, choose the larger size.',
              'Not sure about your size? Send us your measurements on WhatsApp and we will recommend the best size for you!',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-blue-400 font-black shrink-0 mt-0.5">•</span>
                <p className="text-sm" style={{color: 'rgba(44,44,44,0.7)'}}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm mb-4" style={{color: 'rgba(44,44,44,0.6)'}}>
            Still not sure about your size? Chat with us!
          </p>
          <a
            href="https://wa.me/2347041304966?text=Hello! I need help with sizing for my order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-white transition-all hover:scale-105"
            style={{background: 'linear-gradient(135deg, #25d366, #128c7e)'}}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Ask About Sizing
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
