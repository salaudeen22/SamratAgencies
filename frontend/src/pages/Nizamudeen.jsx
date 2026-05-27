import { Helmet } from 'react-helmet-async';

const Nizamudeen = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#fafaf9' }}>
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
            "description": "Nizamudeen S.A. is the founder of Samrat Agencies, established in 1996 in Bangalore.",
            "image": "https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_u4zctmu4zctmu4zc.png",
            "url": "https://samratagencies.in/about/nizamudeen",
            "foundingDate": "1996",
            "worksFor": { "@type": "LocalBusiness", "name": "Samrat Agencies", "url": "https://samratagencies.in" },
            "children": { "@type": "Person", "name": "Azarudeen", "jobTitle": "Owner & Managing Director", "url": "https://samratagencies.in/about/azarudeen" }
          }
        `}</script>
      </Helmet>

      {/* ─── HERO ─── */}
      <section className="relative flex items-end overflow-hidden"
        style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0e0905 0%, #1a0f08 45%, #2F1A0F 100%)' }}>

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 35% 42%, rgba(215,183,144,0.08) 0%, transparent 65%)'
        }} />

        {/* Photo */}
        <div className="absolute inset-0 md:right-auto md:left-0 md:w-[55%] overflow-hidden">
          <img
            src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_u4zctmu4zctmu4zc.png"
            alt="Nizamudeen S.A. – Founder, Samrat Agencies"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.45) saturate(0.7)', objectPosition: '50% 15%' }}
          />
          {/* Mobile overlay */}
          <div className="absolute inset-0 md:hidden" style={{
            background: 'linear-gradient(to top, #0e0905 30%, rgba(14,9,5,0.8) 58%, rgba(14,9,5,0.45) 100%)'
          }} />
          {/* Tablet + desktop overlay */}
          <div className="absolute inset-0 hidden md:block" style={{
            background: 'linear-gradient(to left, #0e0905 0%, rgba(14,9,5,0.85) 22%, transparent 60%), linear-gradient(to top, #0e0905 0%, transparent 45%)'
          }} />
        </div>

        {/* Content — left on mobile, right-aligned on md+ */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-16 pb-10 sm:pb-14 lg:pb-20 pt-24 sm:pt-32 md:pt-40">
          <div className="md:ml-auto max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <p className="text-xs font-bold tracking-[0.28em] uppercase mb-4 sm:mb-5" style={{ color: '#816047' }}>
              Founder · Samrat Agencies · Since 1996
            </p>
            <h1 style={{
              fontSize: 'clamp(2.6rem, 9vw, 6.5rem)',
              fontWeight: 900, lineHeight: 1,
              letterSpacing: '-0.03em', color: '#ffffff', textTransform: 'uppercase'
            }}>
              Nizamudeen
            </h1>
            <p style={{
              fontSize: 'clamp(0.9rem, 2.5vw, 1.6rem)',
              fontWeight: 700, letterSpacing: '0.15em',
              color: '#D7B790', marginTop: '0.25rem', textTransform: 'uppercase'
            }}>
              S. A.
            </p>
            <div className="w-14 h-px my-4 sm:my-5" style={{ backgroundColor: '#816047' }} />
            <p className="leading-relaxed" style={{ fontSize: 'clamp(0.82rem, 2vw, 1rem)', color: '#b89a7a', maxWidth: '38ch' }}>
              In 1996, with modest savings and an unshakeable belief in honest business, he opened a small electronics shop in Bangalore. What he built over the next three decades became a household name.
            </p>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-7 sm:mt-9">
              {[
                { n: '1996', l: 'Year Founded' },
                { n: '30+', l: 'Years of Trust' },
                { n: '1Cr+', l: 'Customers' },
                { n: '2nd Gen', l: 'Legacy Lives On' },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, color: '#D7B790', lineHeight: 1 }}>{s.n}</div>
                  <div className="text-xs tracking-widest uppercase mt-1 leading-tight" style={{ color: 'rgba(184,154,122,0.7)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUOTE ─── */}
      <section style={{ backgroundColor: '#2F1A0F' }} className="py-10 sm:py-14 lg:py-16 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div style={{ fontSize: 'clamp(3.5rem,8vw,5.5rem)', lineHeight: 0.5, color: '#816047', fontFamily: 'Georgia,serif', opacity: 0.5 }}>"</div>
          <blockquote style={{ fontSize: 'clamp(1rem,2.5vw,1.6rem)', fontStyle: 'italic', color: '#E6CDB1', lineHeight: 1.6 }} className="mt-4 font-light">
            Build something people can trust, and they will never forget you.
          </blockquote>
          <p className="mt-5 text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: '#816047' }}>
            Nizamudeen S.A. · Founder, Samrat Agencies · 1996
          </p>
        </div>
      </section>

      {/* ─── EDITORIAL PROFILE ─── */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-16">

          <div className="flex items-center gap-4 mb-8 sm:mb-12">
            <span className="text-xs font-bold tracking-[0.28em] uppercase flex-shrink-0" style={{ color: '#816047' }}>The Founder</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(129,96,71,0.2)' }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

            {/* Watermark — lg+ only */}
            <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
              <div style={{
                writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                fontSize: 'clamp(2.8rem,3.5vw,4.2rem)', fontWeight: 900,
                letterSpacing: '-0.04em', color: 'rgba(129,96,71,0.07)',
                lineHeight: 1, userSelect: 'none'
              }}>NIZAMUDEEN</div>
            </div>

            <div className="lg:col-span-9 space-y-8 sm:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
                <div>
                  <h2 style={{ fontSize: 'clamp(1.6rem,4vw,3rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#2F1A0F' }} className="mb-4 sm:mb-5">
                    The man who started it all.
                  </h2>
                  <p className="leading-relaxed" style={{ fontSize: 'clamp(0.85rem,1.6vw,1rem)', color: '#5a3820' }}>
                    In 1996, Bangalore was a different city. Nizamudeen S.A. opened a modest electronics shop with everything he had — savings, determination, and a deep belief that if you treated people right, the business would take care of itself.
                  </p>
                </div>
                <div className="space-y-4 md:flex md:flex-col md:justify-end">
                  <p className="leading-relaxed" style={{ fontSize: 'clamp(0.85rem,1.6vw,1rem)', color: '#5a3820' }}>
                    He was right. Within months, word spread through the neighbourhood. This was a shop where you could trust the advice, trust the products, and trust the price. No marketing. No billboard. No ads. Just word of mouth, earned every single day.
                  </p>
                  <p className="leading-relaxed" style={{ fontSize: 'clamp(0.85rem,1.6vw,1rem)', color: '#5a3820' }}>
                    That trust grew into something that could not be bought — a reputation. And that reputation became a legacy that his son Azarudeen now carries forward with equal devotion.
                  </p>
                </div>
              </div>

              {/* Photo */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden w-full" style={{ aspectRatio: '16 / 9' }}>
                <img
                  src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_u4zctmu4zctmu4zc.png"
                  alt="Nizamudeen S.A. – Samrat Agencies founder"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '50% 15%' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(47,26,15,0.9) 0%, transparent 55%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-white font-bold" style={{ fontSize: 'clamp(0.9rem,2vw,1.1rem)' }}>Nizamudeen S.A.</p>
                    <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: '#D7B790' }}>Founder · Samrat Agencies · Est. 1996</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase hidden sm:block"
                    style={{ backgroundColor: 'rgba(215,183,144,0.2)', border: '1px solid #D7B790', color: '#D7B790' }}>
                    Since 1996
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FULL STORY ─── */}
      <section style={{ backgroundColor: '#f5f0eb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-16">
          <div className="text-center py-10 sm:py-14 lg:py-16">
            <p className="text-xs font-bold tracking-[0.28em] uppercase mb-3" style={{ color: '#816047' }}>His Story</p>
            <h2 style={{ fontSize: 'clamp(1.6rem,4vw,3rem)', fontWeight: 900, letterSpacing: '-0.02em', color: '#2F1A0F' }}>The Full Story</h2>
          </div>

          {[
            { ch: '01', title: 'A Dream That Started Small', aside: 'Small capital. Crystal-clear vision. Everything else followed.', body: 'In 1996, Bangalore was a different city. Nizamudeen S.A. opened a modest electronics shop with everything he had — savings, determination, and a deep belief that if you treated people right, the business would take care of itself. He was right. Within months, word spread through the neighbourhood. This was a shop where you could trust the advice, trust the products, and trust the price.' },
            { ch: '02', title: 'The Reputation That Grew Organically', aside: 'Pure word of mouth. The oldest and most powerful marketing there is.', body: 'There was no marketing budget. No billboard. No online ads. His strategy was simple: give every customer a reason to tell their neighbour. He would spend hours with a single family, making sure they left with exactly what they needed — not what made the highest margin. That honesty was his most powerful tool. One branch became two. Two became several.' },
            { ch: '03', title: 'Listening to Customers, Changing Direction', aside: 'He listened before he led. That discipline is his greatest lesson.', body: 'Over time, something interesting happened. Customers who came in for electronics started asking: "Do you know where I can find a good mattress? A sofa that will actually last?" They trusted Nizamudeen\'s recommendation above anyone else\'s. That feedback planted a seed. Why not give those same families the same trustworthy experience for their entire home?' },
            { ch: '04', title: 'The Pivot to Furniture & Mattresses', aside: 'From electronics to furniture — a pivot toward what customers already trusted him for.', body: 'Nizamudeen made the bold decision to transition Samrat Agencies into furniture and mattresses — partnering with India\'s most trusted brands. He approached every brand partnership the same way he approached every customer: with honesty and a long-term view. He wasn\'t looking for quick commissions. He was building a destination that families could rely on for decades.' },
            { ch: '05', title: "A Father's Greatest Achievement", aside: 'The greatest thing a founder can leave behind is someone who carries the values forward.', body: "Ask Nizamudeen what he is most proud of, and he will not mention the showroom or the brand partnerships. He will talk about his son Azarudeen — the fact that every value he tried to live by was absorbed, internalized, and is now being carried forward with even more energy and vision. The business was never just a business. It was always meant to be a legacy." },
          ].map((item, i) => (
            <div key={item.ch}
              className={`py-7 sm:py-9 lg:py-10 ${i < 4 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(129,96,71,0.15)' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
                <div className="hidden lg:flex lg:col-span-1 items-start">
                  <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'rgba(129,96,71,0.14)', lineHeight: 1 }}>{item.ch}</span>
                </div>
                <div className="md:col-span-2 lg:col-span-7">
                  <div className="flex items-baseline gap-3 mb-2 lg:mb-3">
                    <span className="text-xs font-black tracking-widest lg:hidden" style={{ color: 'rgba(129,96,71,0.4)' }}>{item.ch}</span>
                    <h3 style={{ fontSize: 'clamp(1rem,2.2vw,1.4rem)', fontWeight: 700, letterSpacing: '-0.01em', color: '#2F1A0F' }}>{item.title}</h3>
                  </div>
                  <p className="leading-relaxed" style={{ fontSize: 'clamp(0.82rem,1.5vw,1rem)', color: '#5a3820' }}>{item.body}</p>
                </div>
                <div className="md:col-span-1 lg:col-span-4 border-t-2 md:border-t-0 md:border-l-2 pt-3 md:pt-0 md:pl-5 lg:pl-8"
                  style={{ borderColor: 'rgba(129,96,71,0.2)' }}>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(129,96,71,0.7)' }}>{item.aside}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="py-12 sm:py-16 lg:py-24" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-16">
            <div className="md:col-span-4 lg:col-span-4">
              <p className="text-xs font-bold tracking-[0.28em] uppercase mb-4" style={{ color: '#816047' }}>The Journey</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,4vw,3rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#2F1A0F' }}>
                30 Years.<br />One Vision.
              </h2>
              <div className="w-14 h-px my-5" style={{ backgroundColor: '#816047' }} />
              <p className="leading-relaxed" style={{ fontSize: 'clamp(0.82rem,1.5vw,1rem)', color: '#5a3820' }}>
                From a single electronics shop to a multi-branch furniture institution. Every milestone was earned, never rushed.
              </p>
            </div>
            <div className="md:col-span-8 lg:col-span-8">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 sm:left-7 top-2 bottom-2 w-px" style={{ backgroundColor: 'rgba(129,96,71,0.2)' }} />
                <div className="space-y-0">
                  {[
                    { year: '1996', title: 'Founded Samrat Agencies', desc: 'Opened a small electronics store in Hongasandra, Bangalore with honesty and trust as the only business model.', last: false },
                    { year: '2000', title: 'First Expansion', desc: 'Growing word-of-mouth led to multiple branches across Bangalore, serving more neighbourhoods and more families.', last: false },
                    { year: '2005', title: 'The Great Pivot', desc: 'Listening to what customers truly needed, Nizamudeen transitioned into furniture and mattresses — partnering with India\'s top brands.', last: false },
                    { year: '2010', title: 'Manufacturing Begins', desc: 'Opened the first manufacturing unit to ensure quality control from raw material to final delivery.', last: false },
                    { year: '2015', title: 'Passing the Torch', desc: 'Son Azarudeen formally takes over as managing director, carrying every value forward into a new era.', last: false },
                    { year: 'Today', title: 'A Living Legacy', desc: '30+ years, 1 crore+ customers, and a family business that still treats every customer like family.', last: true },
                  ].map((item) => (
                    <div key={item.year} className="relative flex gap-5 sm:gap-7 pb-8 sm:pb-9">
                      <div className="flex-shrink-0 w-10 sm:w-14 flex justify-center">
                        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full mt-1.5 relative z-10"
                          style={{ backgroundColor: item.last ? '#D7B790' : '#816047', border: '2px solid #fafaf9', boxShadow: '0 0 0 3px rgba(129,96,71,0.15)' }} />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-black tracking-widest uppercase block mb-1" style={{ color: item.last ? '#D7B790' : '#816047' }}>{item.year}</span>
                        <h3 style={{ fontSize: 'clamp(0.9rem,1.8vw,1.1rem)', fontWeight: 700, color: '#2F1A0F' }} className="mb-1">{item.title}</h3>
                        <p style={{ fontSize: 'clamp(0.78rem,1.3vw,0.9rem)', color: 'rgba(90,56,32,0.7)', lineHeight: 1.6 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEGACY STATS ─── */}
      <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#1a0d08' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(129,96,71,0.15)' }}>
            {[
              { n: '1996', l: 'Year Founded', sub: '30 years of unbroken trust.' },
              { n: '1Cr+', l: 'Customers Served', sub: 'Families across Bangalore.' },
              { n: '30+', l: 'Years of Legacy', sub: 'Built on honesty alone.' },
              { n: '2nd Gen', l: 'Legacy Continues', sub: 'Son Azarudeen carries it forward.' },
            ].map(s => (
              <div key={s.l} className="p-5 sm:p-7 lg:p-9" style={{ backgroundColor: '#1a0d08' }}>
                <div style={{ fontSize: 'clamp(1.6rem,4.5vw,3.2rem)', fontWeight: 900, color: '#D7B790', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.n}</div>
                <div style={{ fontSize: 'clamp(0.7rem,1.4vw,0.88rem)', fontWeight: 700, color: '#ffffff', marginTop: '0.4rem', marginBottom: '0.2rem' }}>{s.l}</div>
                <div className="text-xs leading-relaxed hidden sm:block" style={{ color: 'rgba(184,154,122,0.55)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLOSING QUOTE ─── */}
      <section className="relative py-16 sm:py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0d08 0%, #2F1A0F 50%, #5a3820 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <div style={{ fontSize: 'clamp(4rem,9vw,7rem)', lineHeight: 0.4, color: '#816047', fontFamily: 'Georgia,serif', opacity: 0.4 }}>"</div>
          <p style={{ fontSize: 'clamp(1rem,2.8vw,2rem)', fontStyle: 'italic', color: '#E6CDB1', lineHeight: 1.6, letterSpacing: '-0.01em' }} className="font-light mt-5">
            The greatest thing a father can do is show his children what integrity looks like in action — every single day.
          </p>
          <p className="mt-7 text-xs tracking-[0.28em] uppercase font-bold" style={{ color: '#816047' }}>
            Nizamudeen S.A. · Founder, Samrat Agencies · Since 1996
          </p>
        </div>
      </section>

      {/* ─── CONTINUE READING ─── */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <a href="/about/azarudeen"
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden flex flex-col"
              style={{ minHeight: '200px', background: 'linear-gradient(135deg, #2F1A0F 0%, #816047 100%)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #1a0d08 0%, #5a3820 100%)' }} />
              <div className="relative z-10 p-7 sm:p-9 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.28em] uppercase mb-2" style={{ color: '#D7B790' }}>Next</p>
                  <h3 style={{ fontSize: 'clamp(1.3rem,3vw,2rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }} className="mb-2">Meet Azarudeen</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(230,205,177,0.7)' }}>
                    The son who took the legacy and built on it — with 10+ brand partnerships, 3 manufacturing units, and a 5-star reputation.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <span className="text-sm font-bold" style={{ color: '#D7B790' }}>Read His Story</span>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ fill: 'none', stroke: '#D7B790', strokeWidth: 2 }} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>

            <a href="/about"
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden flex flex-col"
              style={{ minHeight: '200px', backgroundColor: '#f5f0eb', border: '2px solid #D7B790' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(215,183,144,0.2)' }} />
              <div className="relative z-10 p-7 sm:p-9 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.28em] uppercase mb-2" style={{ color: '#816047' }}>Our Story</p>
                  <h3 style={{ fontSize: 'clamp(1.3rem,3vw,2rem)', fontWeight: 900, color: '#2F1A0F', letterSpacing: '-0.02em' }} className="mb-2">The Full Legacy</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5a3820' }}>
                    Discover the complete story of Samrat Agencies — from a small electronics shop in 1996 to Bangalore's most trusted furniture destination.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <span className="text-sm font-bold" style={{ color: '#816047' }}>Explore the Story</span>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ fill: 'none', stroke: '#816047', strokeWidth: 2 }} viewBox="0 0 24 24">
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
