import { Helmet } from 'react-helmet-async';

const Nizamudeen = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
      <Helmet>
        <title>Nizamudeen S.A. – Founder of Samrat Agencies Bangalore | Since 1996</title>
        <meta name="description" content="Meet Mr. Nizamudeen S.A., the visionary founder of Samrat Agencies. Starting from a small electronics shop in 1996, he built Bangalore's most trusted furniture legacy." />
        <meta name="keywords" content="Nizamudeen Samrat Agencies, Nizamudeen founder Bangalore, Samrat Agencies 1996 founder, furniture store founder Bangalore Hongasandra" />
        <meta property="og:title" content="Nizamudeen S.A. – Founder of Samrat Agencies Since 1996" />
        <meta property="og:description" content="The story of Mr. Nizamudeen S.A. who started Samrat Agencies in 1996 and built it into a trusted household name across Bangalore." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://samratagencies.in/about/nizamudeen" />
        <meta property="og:image" content="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_u4zctmu4zctmu4zc.png" />
        <link rel="canonical" href="https://samratagencies.in/about/nizamudeen" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://samratagencies.in/about/nizamudeen#person",
            "name": "Nizamudeen S.A.",
            "jobTitle": "Founder",
            "description": "Nizamudeen S.A. is the founder of Samrat Agencies, which he established in 1996 as a small electronics store in Bangalore before transforming it into a leading furniture and mattress retailer trusted by over 1 crore customers.",
            "image": "https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_u4zctmu4zctmu4zc.png",
            "url": "https://samratagencies.in/about/nizamudeen",
            "foundingDate": "1996",
            "worksFor": {
              "@type": "LocalBusiness",
              "name": "Samrat Agencies",
              "url": "https://samratagencies.in",
              "foundingDate": "1996"
            },
            "children": {
              "@type": "Person",
              "name": "Azarudeen",
              "jobTitle": "Owner & Managing Director",
              "url": "https://samratagencies.in/about/azarudeen"
            }
          }
        `}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative text-white py-24 md:py-40 overflow-hidden"
        style={{ backgroundImage: 'linear-gradient(135deg, #1a0f08 0%, #2F1A0F 50%, #5a3820 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#D7B790' }}>
            Founder · Samrat Agencies · Established 1996
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
            Nizamudeen S.A.
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#E6CDB1' }}>
            The man who started it all — with nothing but a dream, a small shop, and an unshakeable belief that honest business is the best business.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { value: '1996', label: 'Year Founded' },
              { value: '30+', label: 'Years of Trust' },
              { value: '1Cr+', label: 'Customers Served' },
              { value: '2nd Gen', label: 'Legacy Continues' },
            ].map((s) => (
              <div key={s.label} className="text-center px-6 py-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(215,183,144,0.4)' }}>
                <div className="text-2xl font-bold" style={{ color: '#D7B790' }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: '#E6CDB1' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Profile */}
      <section className="py-20 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ border: '2px solid #D7B790' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-14 flex flex-col justify-center order-2 lg:order-1">
                <div className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: '#816047' }}>
                  THE FOUNDER · 1996
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-2" style={{ color: '#2F1A0F' }}>Nizamudeen S.A.</h2>
                <div className="w-16 h-1 rounded-full mb-6" style={{ backgroundColor: '#816047' }} />
                <blockquote className="text-xl italic leading-relaxed mb-6 font-medium" style={{ color: '#816047' }}>
                  "Build something people can trust, and they'll never forget you."
                </blockquote>
                <p className="text-base leading-relaxed mb-4" style={{ color: '#2F1A0F' }}>
                  It was <strong>1996</strong> when Mr. Nizamudeen S.A. opened the doors of what would become a household name in Bangalore — <strong>Samrat Agencies Electronic Store</strong>. The shop was small. The capital was modest. But the vision was crystal clear: serve people honestly, and they will always come back.
                </p>
                <p className="text-base leading-relaxed mb-4" style={{ color: '#2F1A0F' }}>
                  He didn't just sell products — he built relationships. He remembered customers' names, their children's names, what they bought last time, and what they needed next. People didn't just shop at Samrat Agencies. They <em>trusted</em> it.
                </p>
                <p className="text-base leading-relaxed" style={{ color: '#2F1A0F' }}>
                  Over time, that trust grew into something extraordinary — a legacy that his son Azarudeen now carries forward with the same values, amplified for a new generation.
                </p>
              </div>
              <div className="relative min-h-[420px] lg:min-h-[580px] order-1 lg:order-2" style={{ backgroundColor: '#E6CDB1' }}>
                <img
                  src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_u4zctmu4zctmu4zc.png"
                  alt="Mr. Nizamudeen S.A. – Founder, Samrat Agencies Bangalore"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-6 right-6 px-4 py-2 rounded-full text-white text-xs font-bold tracking-widest uppercase shadow-lg"
                  style={{ backgroundColor: '#2F1A0F' }}>
                  Founder · 1996
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2F1A0F' }}>The Full Story</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: '#816047' }} />
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg" style={{ border: '2px solid #D7B790' }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2F1A0F' }}>A Dream That Started Small</h3>
              <p className="leading-relaxed" style={{ color: 'rgba(129,96,71,0.8)' }}>
                In 1996, Bangalore was a different city. Mr. Nizamudeen S.A. opened a modest electronics shop with everything he had — savings, determination, and a deep belief that if you treated people right, the business would take care of itself. He was right. Within months, word spread through the neighbourhood. This was a shop where you could trust the advice, trust the products, and trust the price.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg" style={{ border: '2px solid #D7B790' }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2F1A0F' }}>The Reputation That Grew Organically</h3>
              <p className="leading-relaxed" style={{ color: 'rgba(129,96,71,0.8)' }}>
                There was no marketing budget. No billboard. No online ads. Nizamudeen's marketing strategy was simple: give every customer a reason to tell their neighbour. He would spend hours with a single family, making sure they left with exactly what they needed — not what made the highest margin. That honesty was his most powerful tool. One branch became two. Two became several.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg" style={{ border: '2px solid #D7B790' }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2F1A0F' }}>Listening to Customers, Changing Direction</h3>
              <p className="leading-relaxed" style={{ color: 'rgba(129,96,71,0.8)' }}>
                Over time, something interesting happened. Customers who came in for electronics started asking: <em>"Do you know where I can find a good mattress? A sofa that will actually last?"</em> They trusted Nizamudeen's recommendation above anyone else's. That feedback planted a seed. Why not give those same families the same trustworthy experience for their entire home? That question led to the pivot that changed everything.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg" style={{ border: '2px solid #D7B790' }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2F1A0F' }}>The Pivot to Furniture & Mattresses</h3>
              <p className="leading-relaxed" style={{ color: 'rgba(129,96,71,0.8)' }}>
                Nizamudeen made the bold decision to transition Samrat Agencies into furniture and mattresses — partnering with India's most trusted brands. He approached every brand partnership the same way he approached every customer: with honesty and a long-term view. He wasn't looking for quick commissions. He was building a destination that families could rely on for decades. That mindset attracted the right partners and created the foundation that Samrat Agencies stands on today.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg" style={{ border: '2px solid #D7B790' }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2F1A0F' }}>A Father's Greatest Achievement</h3>
              <p className="leading-relaxed" style={{ color: 'rgba(129,96,71,0.8)' }}>
                Ask Nizamudeen what he's most proud of, and he won't mention the showroom or the brand partnerships. He'll talk about his son Azarudeen — the fact that every value he tried to live by was absorbed, internalized, and is now being carried forward with even more energy and vision. The business was never just a business. It was always meant to be a legacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16" style={{ background: 'linear-gradient(to bottom, #fff, #f5f0eb)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2F1A0F' }}>His Journey Through the Years</h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: '#816047' }} />
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { year: '1996', title: 'Founded Samrat Agencies', desc: 'Opened a small electronics store in Bangalore with honesty and trust as the core values.' },
              { year: '2000', title: 'First Expansion', desc: 'Growing word-of-mouth led to multiple branches across Bangalore serving more neighbourhoods.' },
              { year: '2005', title: 'The Big Pivot', desc: 'Listening to customers, transitioned into furniture and mattresses — partnering with India\'s top brands.' },
              { year: '2010', title: 'Manufacturing Begins', desc: 'Opened the first manufacturing unit to ensure quality control from the ground up.' },
              { year: '2015', title: 'Passing the Torch', desc: 'Son Azarudeen formally takes over as managing director, carrying the same values forward.' },
              { year: 'Today', title: 'A Living Legacy', desc: '30+ years, 1 crore+ customers, and a family business that still treats every customer like family.' },
            ].map((item, i) => (
              <div key={item.year} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="text-sm font-bold" style={{ color: '#816047' }}>{item.year}</span>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: '#816047' }} />
                  {i < 5 && <div className="w-0.5 h-16 mt-1" style={{ backgroundColor: '#D7B790' }} />}
                </div>
                <div className="bg-white rounded-xl p-6 shadow flex-1 -mt-1" style={{ border: '1px solid #D7B790' }}>
                  <h3 className="font-bold mb-1" style={{ color: '#2F1A0F' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(129,96,71,0.7)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-12 text-center text-white"
            style={{ background: 'linear-gradient(135deg, #2F1A0F 0%, #816047 100%)' }}>
            <p className="text-2xl sm:text-3xl font-bold leading-relaxed max-w-3xl mx-auto" style={{ color: '#E6CDB1' }}>
              "The greatest thing a father can do is show his children what integrity looks like in action — every single day."
            </p>
            <p className="mt-6 text-sm font-semibold tracking-widest uppercase" style={{ color: '#D7B790' }}>
              Nizamudeen S.A. · Founder, Samrat Agencies · Since 1996
            </p>
          </div>
        </div>
      </section>

      {/* Back links */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-6" style={{ color: '#2F1A0F' }}>Continue Reading</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/about/azarudeen"
              className="px-8 py-4 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90"
              style={{ backgroundColor: '#816047' }}>
              Meet Azarudeen — Current Leader
            </a>
            <a href="/about"
              className="px-8 py-4 rounded-xl font-semibold text-base transition-all hover:opacity-90"
              style={{ backgroundColor: '#E6CDB1', color: '#2F1A0F' }}>
              Our Full Story
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nizamudeen;
