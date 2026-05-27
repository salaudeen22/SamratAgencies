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

      {/* ── HERO ── */}
      <section className="relative flex items-end overflow-hidden"
        style={{ minHeight: '100svh', background: 'linear-gradient(160deg, #0e0905 0%, #1a0f08 45%, #2F1A0F 100%)' }}>

        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 35% 40%, rgba(215,183,144,0.08) 0%, transparent 65%)'
        }} />

        {/* Photo — full-width on mobile, left-half on desktop */}
        <div className="absolute inset-0 lg:right-auto lg:left-0 lg:w-[55%] overflow-hidden">
          <img
            src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_u4zctmu4zctmu4zc.png"
            alt="Nizamudeen S.A. – Founder, Samrat Agencies"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.5) saturate(0.7)', objectPosition: '50% 15%' }}
          />
          {/* Mobile: heavy bottom fade so text is readable */}
          <div className="absolute inset-0 lg:hidden" style={{
            background: 'linear-gradient(to top, #0e0905 35%, rgba(14,9,5,0.75) 60%, rgba(14,9,5,0.5) 100%)'
          }} />
          {/* Desktop: right edge fade into background */}
          <div className="absolute inset-0 hidden lg:block" style={{
            background: 'linear-gradient(to left, #0e0905 0%, rgba(14,9,5,0.8) 25%, transparent 60%), linear-gradient(to top, #0e0905 0%, transparent 40%)'
          }} />
        </div>

        {/* Content — left on mobile, right-aligned on desktop */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 pb-12 pt-28 sm:pt-36 lg:pb-20">
          <div className="lg:ml-auto max-w-xl lg:max-w-2xl">
            <p className="text-xs font-bold tracking-[0.35em] uppercase mb-5" style={{ color: '#816047' }}>
              Founder · Samrat Agencies · Since 1996
            </p>
            <h1 style={{
              fontSize: 'clamp(2.8rem, 10vw, 6.5rem)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              textTransform: 'uppercase'
            }}>
              Nizamudeen
            </h1>
            <div style={{
              fontSize: 'clamp(1rem, 3vw, 1.8rem)',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#D7B790',
              marginTop: '0.25rem',
              textTransform: 'uppercase'
            }}>
              S. A.
            </div>
            <div className="w-16 h-px mt-5 mb-5" style={{ backgroundColor: '#816047' }} />
            <p className="text-sm sm:text-base leading-relaxed max-w-md" style={{ color: '#b89a7a' }}>
              In 1996, with modest savings and an unshakeable belief in honest business, he opened a small electronics shop in Bangalore. What he built over the next three decades became a household name.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-8">
              {[
                { n: '1996', l: 'Year Founded' },
                { n: '30+', l: 'Years of Trust' },
                { n: '1Cr+', l: 'Customers' },
                { n: '2nd Gen', l: 'Legacy Lives On' },
              ].map(s => (
                <div key={s.l}>
                  <div className="text-2xl sm:text-3xl font-black" style={{ color: '#D7B790' }}>{s.n}</div>
                  <div className="text-xs tracking-widest uppercase mt-1 leading-tight" style={{ color: 'rgba(184,154,122,0.7)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNATURE QUOTE ── */}
      <section style={{ backgroundColor: '#2F1A0F' }} className="py-12 sm:py-16 px-5 sm:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <div style={{ fontSize: '5rem', lineHeight: 0.5, color: '#816047', fontFamily: 'Georgia, serif', opacity: 0.5 }}>"</div>
          <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mt-4" style={{ color: '#E6CDB1', fontStyle: 'italic' }}>
            Build something people can trust, and they will never forget you.
          </blockquote>
          <div className="mt-5 text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: '#816047' }}>
            Nizamudeen S.A. · Founder, Samrat Agencies · 1996
          </div>
        </div>
      </section>

      {/* ── EDITORIAL PROFILE ── */}
      <section className="py-14 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">

          <div className="flex items-center gap-4 mb-10">
            <div className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#816047' }}>The Founder</div>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(129,96,71,0.2)' }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

            {/* Watermark — desktop only */}
            <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
              <div style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                fontSize: '3.8rem',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: 'rgba(129,96,71,0.08)',
                lineHeight: 1,
                userSelect: 'none',
              }}>NIZAMUDEEN</div>
            </div>

            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5" style={{ color: '#2F1A0F', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                    The man who started it all.
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: '#5a3820' }}>
                    In 1996, Bangalore was a different city. Nizamudeen S.A. opened a modest electronics shop with everything he had — savings, determination, and a deep belief that if you treated people right, the business would take care of itself.
                  </p>
                </div>
                <div className="flex flex-col justify-end gap-5">
                  <p className="text-base leading-relaxed" style={{ color: '#5a3820' }}>
                    He was right. Within months, word spread through the neighbourhood. This was a shop where you could trust the advice, trust the products, and trust the price. No marketing. No billboard. No ads. Just word of mouth, earned every single day.
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: '#5a3820' }}>
                    That trust grew into something that could not be bought — a reputation. And that reputation became a legacy that his son Azarudeen now carries forward with equal devotion.
                  </p>
                </div>
              </div>

              {/* Photo */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img
                  src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_u4zctmu4zctmu4zc.png"
                  alt="Nizamudeen S.A. – Samrat Agencies founder"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '50% 15%' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(47,26,15,0.9) 0%, transparent 55%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <p className="text-white font-bold text-base sm:text-lg">Nizamudeen S.A.</p>
                  <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: '#D7B790' }}>Founder · Samrat Agencies · Est. 1996</p>
                </div>
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                  style={{ backgroundColor: 'rgba(215,183,144,0.2)', border: '1px solid #D7B790', color: '#D7B790' }}>
                  Since 1996
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL STORY ── */}
      <section style={{ backgroundColor: '#f5f0eb' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="text-center py-12 sm:py-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#816047' }}>His Story</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ color: '#2F1A0F', letterSpacing: '-0.02em' }}>The Full Story</h2>
          </div>

          {[
            { chapter: '01', title: 'A Dream That Started Small', aside: 'Small capital. Crystal-clear vision. Everything else followed.', body: 'In 1996, Bangalore was a different city. Nizamudeen S.A. opened a modest electronics shop with everything he had — savings, determination, and a deep belief that if you treated people right, the business would take care of itself. He was right. Within months, word spread through the neighbourhood. This was a shop where you could trust the advice, trust the products, and trust the price.' },
            { chapter: '02', title: 'The Reputation That Grew Organically', aside: 'Pure word of mouth. The oldest and most powerful marketing there is.', body: 'There was no marketing budget. No billboard. No online ads. His strategy was simple: give every customer a reason to tell their neighbour. He would spend hours with a single family, making sure they left with exactly what they needed — not what made the highest margin. That honesty was his most powerful tool. One branch became two. Two became several.' },
            { chapter: '03', title: 'Listening to Customers, Changing Direction', aside: 'He listened before he led. That discipline is his greatest lesson.', body: 'Over time, something interesting happened. Customers who came in for electronics started asking: "Do you know where I can find a good mattress? A sofa that will actually last?" They trusted Nizamudeen\'s recommendation above anyone else\'s. That feedback planted a seed. Why not give those same families the same trustworthy experience for their entire home?' },
            { chapter: '04', title: 'The Pivot to Furniture & Mattresses', aside: 'From electronics to furniture — a pivot toward what customers already trusted him for.', body: 'Nizamudeen made the bold decision to transition Samrat Agencies into furniture and mattresses — partnering with India\'s most trusted brands. He approached every brand partnership the same way he approached every customer: with honesty and a long-term view. He wasn\'t looking for quick commissions. He was building a destination that families could rely on for decades.' },
            { chapter: '05', title: "A Father's Greatest Achievement", aside: 'The greatest thing a founder can leave behind is someone who carries the values forward.', body: "Ask Nizamudeen what he is most proud of, and he will not mention the showroom or the brand partnerships. He will talk about his son Azarudeen — the fact that every value he tried to live by was absorbed, internalized, and is now being carried forward with even more energy and vision. The business was never just a business. It was always meant to be a legacy." },
          ].map((item, i) => (
            <div key={item.chapter}
              className={`py-8 sm:py-10 ${i < 4 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(129,96,71,0.15)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                <div className="hidden lg:flex lg:col-span-1 items-start">
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: 'rgba(129,96,71,0.15)', lineHeight: 1 }}>{item.chapter}</span>
                </div>
                <div className="lg:col-span-7">
                  <div className="flex items-baseline gap-3 mb-3 lg:block">
                    <span className="text-xs font-black tracking-widest lg:hidden" style={{ color: 'rgba(129,96,71,0.4)' }}>{item.chapter}</span>
                    <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#2F1A0F', letterSpacing: '-0.01em' }}>{item.title}</h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#5a3820' }}>{item.body}</p>
                </div>
                <div className="lg:col-span-4 border-t-2 pt-4 lg:border-t-0 lg:border-l-2 lg:pl-8 lg:pt-0"
                  style={{ borderColor: 'rgba(129,96,71,0.2)' }}>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(129,96,71,0.7)' }}>{item.aside}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-14 sm:py-20 lg:py-24" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#816047' }}>The Journey</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight" style={{ color: '#2F1A0F', letterSpacing: '-0.02em' }}>
                30 Years.<br />One Vision.
              </h2>
              <div className="w-16 h-px mt-5" style={{ backgroundColor: '#816047' }} />
              <p className="mt-5 text-sm sm:text-base leading-relaxed" style={{ color: '#5a3820' }}>
                From a single electronics shop to a multi-branch furniture institution. Every milestone was earned, never rushed.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 sm:left-8 top-3 bottom-3 w-px" style={{ backgroundColor: 'rgba(129,96,71,0.2)' }} />
                <div className="space-y-0">
                  {[
                    { year: '1996', title: 'Founded Samrat Agencies', desc: 'Opened a small electronics store in Hongasandra, Bangalore with honesty and trust as the only business model.', last: false },
                    { year: '2000', title: 'First Expansion', desc: 'Growing word-of-mouth led to multiple branches across Bangalore, serving more neighbourhoods and more families.', last: false },
                    { year: '2005', title: 'The Great Pivot', desc: 'Listening to what customers truly needed, Nizamudeen transitioned into furniture and mattresses — partnering with India\'s top brands.', last: false },
                    { year: '2010', title: 'Manufacturing Begins', desc: 'Opened the first manufacturing unit to ensure quality control from raw material to final delivery.', last: false },
                    { year: '2015', title: 'Passing the Torch', desc: 'Son Azarudeen formally takes over as managing director, carrying every value forward into a new era.', last: false },
                    { year: 'Today', title: 'A Living Legacy', desc: '30+ years, 1 crore+ customers, and a family business that still treats every customer like family.', last: true },
                  ].map((item, i) => (
                    <div key={item.year} className="relative flex gap-6 sm:gap-8 pb-9 sm:pb-10">
                      <div className="flex-shrink-0 w-12 sm:w-16 flex justify-center">
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full mt-1.5 relative z-10"
                          style={{ backgroundColor: item.last ? '#D7B790' : '#816047', border: '2px solid #fafaf9', boxShadow: '0 0 0 4px rgba(129,96,71,0.15)' }} />
                      </div>
                      <div className="flex-1 pb-2">
                        <span className="text-xs font-black tracking-widest uppercase block mb-1.5" style={{ color: item.last ? '#D7B790' : '#816047' }}>{item.year}</span>
                        <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: '#2F1A0F' }}>{item.title}</h3>
                        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(90,56,32,0.7)' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEGACY STATS ── */}
      <section className="py-14 sm:py-20" style={{ backgroundColor: '#1a0d08' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(129,96,71,0.15)' }}>
            {[
              { n: '1996', l: 'Year Founded', sub: '30 years of unbroken trust.' },
              { n: '1Cr+', l: 'Customers Served', sub: 'Families across Bangalore.' },
              { n: '30+', l: 'Years of Legacy', sub: 'Built on honesty alone.' },
              { n: '2nd Gen', l: 'Legacy Continues', sub: 'Son Azarudeen carries it forward.' },
            ].map(s => (
              <div key={s.l} className="p-6 sm:p-8 lg:p-10" style={{ backgroundColor: '#1a0d08' }}>
                <div style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 900, color: '#D7B790', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.n}</div>
                <div className="text-xs sm:text-sm font-bold mt-2 mb-1 tracking-wide" style={{ color: '#ffffff' }}>{s.l}</div>
                <div className="text-xs leading-relaxed hidden sm:block" style={{ color: 'rgba(184,154,122,0.55)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING QUOTE ── */}
      <section className="relative py-20 sm:py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0d08 0%, #2F1A0F 50%, #5a3820 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-10 text-center">
          <div style={{ fontSize: '6rem', lineHeight: 0.4, color: '#816047', fontFamily: 'Georgia, serif', opacity: 0.4 }}>"</div>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed mt-5" style={{ color: '#E6CDB1', fontStyle: 'italic', letterSpacing: '-0.01em' }}>
            The greatest thing a father can do is show his children what integrity looks like in action — every single day.
          </p>
          <div className="mt-7 text-xs tracking-[0.3em] uppercase font-bold" style={{ color: '#816047' }}>
            Nizamudeen S.A. · Founder, Samrat Agencies · Since 1996
          </div>
        </div>
      </section>

      {/* ── CONTINUE READING ── */}
      <section className="py-14 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            <a href="/about/azarudeen"
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden flex flex-col"
              style={{ minHeight: '220px', background: 'linear-gradient(135deg, #2F1A0F 0%, #816047 100%)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #1a0d08 0%, #5a3820 100%)' }} />
              <div className="relative z-10 p-8 sm:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2 sm:mb-3" style={{ color: '#D7B790' }}>Next</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 sm:mb-3" style={{ letterSpacing: '-0.02em' }}>Meet Azarudeen</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(230,205,177,0.7)' }}>
                    The son who took the legacy and built on it — with 10+ brand partnerships, 3 manufacturing units, and a 5-star reputation.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <span className="text-sm font-bold" style={{ color: '#D7B790' }}>Read His Story</span>
                  <svg className="w-4 h-4" style={{ fill: 'none', stroke: '#D7B790', strokeWidth: 2 }} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>

            <a href="/about"
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden flex flex-col"
              style={{ minHeight: '220px', backgroundColor: '#f5f0eb', border: '2px solid #D7B790' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(215,183,144,0.2)' }} />
              <div className="relative z-10 p-8 sm:p-10 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2 sm:mb-3" style={{ color: '#816047' }}>Our Story</p>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3" style={{ color: '#2F1A0F', letterSpacing: '-0.02em' }}>The Full Legacy</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5a3820' }}>
                    Discover the complete story of Samrat Agencies — from a small electronics shop in 1996 to Bangalore's most trusted furniture destination.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <span className="text-sm font-bold" style={{ color: '#816047' }}>Explore the Story</span>
                  <svg className="w-4 h-4" style={{ fill: 'none', stroke: '#816047', strokeWidth: 2 }} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nizamudeen;
