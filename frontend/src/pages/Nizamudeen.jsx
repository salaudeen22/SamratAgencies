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

      {/* ── HERO ── full-bleed, vintage-editorial */}
      <section className="relative min-h-screen flex items-end overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0e0905 0%, #1a0f08 45%, #2F1A0F 100%)' }}>

        {/* Grain / texture overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          opacity: 0.6
        }} />

        {/* Radial warm glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 65% 40%, rgba(215,183,144,0.1) 0%, transparent 65%)'
        }} />

        {/* Photo — left-center, large */}
        <div className="absolute left-0 top-0 bottom-0 w-full lg:w-[55%] overflow-hidden">
          <img
            src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_u4zctmu4zctmu4zc.png"
            alt="Nizamudeen S.A. – Founder, Samrat Agencies"
            className="w-full h-full object-cover object-top"
            style={{ filter: 'brightness(0.65) saturate(0.7)' }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to left, #0e0905 0%, rgba(14,9,5,0.75) 25%, transparent 60%), linear-gradient(to top, #0e0905 0%, transparent 40%)'
          }} />
        </div>

        {/* Content — right-aligned on desktop */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20 pt-40 w-full">
          <div className="ml-auto max-w-xl lg:max-w-2xl">
            <p className="text-xs font-bold tracking-[0.35em] uppercase mb-6" style={{ color: '#816047' }}>
              Founder &nbsp;·&nbsp; Samrat Agencies &nbsp;·&nbsp; Since 1996
            </p>
            <h1 style={{
              fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              textTransform: 'uppercase'
            }}>
              Nizamudeen
            </h1>
            <div style={{
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#D7B790',
              marginTop: '0.25rem',
              textTransform: 'uppercase'
            }}>
              S. A.
            </div>
            <div className="w-24 h-px mt-6 mb-6" style={{ backgroundColor: '#816047' }} />
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: '#b89a7a' }}>
              In 1996, with modest savings and an unshakeable belief in honest business, he opened a small electronics shop in Bangalore. What he built over the next three decades became a household name.
            </p>

            {/* Legacy stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
              {[
                { n: '1996', l: 'Year Founded' },
                { n: '30+', l: 'Years of Trust' },
                { n: '1Cr+', l: 'Customers' },
                { n: '2nd Gen', l: 'Legacy Lives On' },
              ].map(s => (
                <div key={s.l} className="flex flex-col">
                  <div className="text-3xl font-black" style={{ color: '#D7B790' }}>{s.n}</div>
                  <div className="text-xs tracking-widest uppercase mt-1 leading-tight" style={{ color: 'rgba(184,154,122,0.7)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNATURE QUOTE ── */}
      <section style={{ backgroundColor: '#2F1A0F' }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div style={{ fontSize: '6rem', lineHeight: 0.5, color: '#816047', fontFamily: 'Georgia, serif', opacity: 0.5 }}>"</div>
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed mt-4" style={{ color: '#E6CDB1', fontStyle: 'italic' }}>
            Build something people can trust, and they will never forget you.
          </blockquote>
          <div className="mt-6 text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: '#816047' }}>
            Nizamudeen S.A. &nbsp;·&nbsp; Founder, Samrat Agencies &nbsp;·&nbsp; 1996
          </div>
        </div>
      </section>

      {/* ── EDITORIAL PROFILE ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* Left: watermark label */}
            <div className="lg:col-span-3 lg:sticky lg:top-24">
              <div className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#816047' }}>The Founder</div>
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

            {/* Right: copy + photo */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
                <div>
                  <h2 className="text-4xl sm:text-5xl font-black mb-6" style={{ color: '#2F1A0F', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                    The man who started it all.
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: '#5a3820' }}>
                    In 1996, Bangalore was a different city. Nizamudeen S.A. opened a modest electronics shop with everything he had — savings, determination, and a deep belief that if you treated people right, the business would take care of itself.
                  </p>
                </div>
                <div>
                  <p className="text-base leading-relaxed mb-5" style={{ color: '#5a3820' }}>
                    He was right. Within months, word spread through the neighbourhood. This was a shop where you could trust the advice, trust the products, and trust the price. No marketing. No billboard. No ads. Just word of mouth, earned every single day.
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: '#5a3820' }}>
                    That trust grew into something that could not be bought — a reputation. And that reputation became a legacy that his son Azarudeen now carries forward with equal devotion.
                  </p>
                </div>
              </div>

              {/* Large photo with caption */}
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
                <img
                  src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_u4zctmu4zctmu4zc.png"
                  alt="Nizamudeen S.A. – Samrat Agencies founder"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(47,26,15,0.9) 0%, transparent 50%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                  <div>
                    <p className="text-white font-bold text-lg">Nizamudeen S.A.</p>
                    <p className="text-xs tracking-widest uppercase" style={{ color: '#D7B790' }}>Founder · Samrat Agencies · Est. 1996</p>
                  </div>
                  <div className="px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase"
                    style={{ backgroundColor: 'rgba(215,183,144,0.2)', border: '1px solid #D7B790', color: '#D7B790' }}>
                    Since 1996
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL STORY ── chapter layout */}
      <section className="py-4" style={{ backgroundColor: '#f5f0eb' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center py-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#816047' }}>His Story</p>
            <h2 className="text-4xl sm:text-5xl font-black" style={{ color: '#2F1A0F', letterSpacing: '-0.02em' }}>The Full Story</h2>
          </div>

          {[
            {
              chapter: '01',
              title: 'A Dream That Started Small',
              body: 'In 1996, Bangalore was a different city. Nizamudeen S.A. opened a modest electronics shop with everything he had — savings, determination, and a deep belief that if you treated people right, the business would take care of itself. He was right. Within months, word spread through the neighbourhood. This was a shop where you could trust the advice, trust the products, and trust the price.',
              aside: 'Small capital. Crystal-clear vision. Everything else followed.',
            },
            {
              chapter: '02',
              title: 'The Reputation That Grew Organically',
              body: 'There was no marketing budget. No billboard. No online ads. His marketing strategy was simple: give every customer a reason to tell their neighbour. He would spend hours with a single family, making sure they left with exactly what they needed — not what made the highest margin. That honesty was his most powerful tool. One branch became two. Two became several.',
              aside: 'Pure word of mouth. The oldest and most powerful marketing there is.',
            },
            {
              chapter: '03',
              title: 'Listening to Customers, Changing Direction',
              body: 'Over time, something interesting happened. Customers who came in for electronics started asking: "Do you know where I can find a good mattress? A sofa that will actually last?" They trusted Nizamudeen\'s recommendation above anyone else\'s. That feedback planted a seed. Why not give those same families the same trustworthy experience for their entire home? That question led to the pivot that changed everything.',
              aside: 'He listened before he led. That discipline is his greatest lesson.',
            },
            {
              chapter: '04',
              title: 'The Pivot to Furniture & Mattresses',
              body: 'Nizamudeen made the bold decision to transition Samrat Agencies into furniture and mattresses — partnering with India\'s most trusted brands. He approached every brand partnership the same way he approached every customer: with honesty and a long-term view. He wasn\'t looking for quick commissions. He was building a destination that families could rely on for decades. That mindset attracted the right partners.',
              aside: 'From electronics to furniture — not a pivot away, but a pivot toward what customers already trusted him for.',
            },
            {
              chapter: '05',
              title: "A Father's Greatest Achievement",
              body: "Ask Nizamudeen what he is most proud of, and he will not mention the showroom or the brand partnerships. He will talk about his son Azarudeen — the fact that every value he tried to live by was absorbed, internalized, and is now being carried forward with even more energy and vision. The business was never just a business. It was always meant to be a legacy.",
              aside: 'The greatest thing a founder can leave behind is someone who carries the values forward.',
            },
          ].map((item, i) => (
            <div key={item.chapter}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 ${i < 4 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(129,96,71,0.15)' }}>
              <div className="lg:col-span-1 flex items-start">
                <span style={{ fontSize: '3rem', fontWeight: 900, color: 'rgba(129,96,71,0.15)', lineHeight: 1 }}>{item.chapter}</span>
              </div>
              <div className="lg:col-span-7">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#2F1A0F', letterSpacing: '-0.01em' }}>{item.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: '#5a3820' }}>{item.body}</p>
              </div>
              <div className="lg:col-span-4 lg:pl-8" style={{ borderLeft: '2px solid rgba(129,96,71,0.2)' }}>
                <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(129,96,71,0.7)' }}>{item.aside}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ── architectural */}
      <section className="py-24" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#816047' }}>The Journey</p>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight" style={{ color: '#2F1A0F', letterSpacing: '-0.02em' }}>
                30 Years.<br />One Vision.
              </h2>
              <div className="w-16 h-px mt-6" style={{ backgroundColor: '#816047' }} />
              <p className="mt-6 text-base leading-relaxed" style={{ color: '#5a3820' }}>
                From a single electronics shop to a multi-branch furniture institution. Every milestone was earned, never rushed.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-8 top-3 bottom-3 w-px" style={{ backgroundColor: 'rgba(129,96,71,0.2)' }} />

                <div className="space-y-0">
                  {[
                    { year: '1996', title: 'Founded Samrat Agencies', desc: 'Opened a small electronics store in Hongasandra, Bangalore with honesty and trust as the only business model.' },
                    { year: '2000', title: 'First Expansion', desc: 'Growing word-of-mouth led to multiple branches across Bangalore, serving more neighbourhoods and more families.' },
                    { year: '2005', title: 'The Great Pivot', desc: 'Listening to what customers truly needed, Nizamudeen transitioned into furniture and mattresses — partnering with India\'s top brands.' },
                    { year: '2010', title: 'Manufacturing Begins', desc: 'Opened the first manufacturing unit to ensure quality control from raw material to final delivery.' },
                    { year: '2015', title: 'Passing the Torch', desc: 'Son Azarudeen formally takes over as managing director, carrying every value forward into a new era.' },
                    { year: 'Today', title: 'A Living Legacy', desc: '30+ years, 1 crore+ customers, and a family business that still treats every customer like family.' },
                  ].map((item, i) => (
                    <div key={item.year} className="relative flex gap-8 pb-10">
                      {/* Dot */}
                      <div className="flex-shrink-0 w-16 flex justify-center">
                        <div className="w-4 h-4 rounded-full mt-1.5 relative z-10"
                          style={{ backgroundColor: i === 5 ? '#D7B790' : '#816047', border: '2px solid #fafaf9', boxShadow: '0 0 0 4px rgba(129,96,71,0.15)' }} />
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-baseline gap-4 mb-2">
                          <span className="text-xs font-black tracking-widest uppercase" style={{ color: i === 5 ? '#D7B790' : '#816047' }}>{item.year}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-1" style={{ color: '#2F1A0F' }}>{item.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(90,56,32,0.7)' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEGACY STATS ── dark band */}
      <section className="py-20" style={{ backgroundColor: '#1a0d08' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: 'rgba(129,96,71,0.15)' }}>
            {[
              { n: '1996', l: 'Year Founded', sub: '30 years of unbroken trust.' },
              { n: '1Cr+', l: 'Customers Served', sub: 'Families across Bangalore.' },
              { n: '30+', l: 'Years of Legacy', sub: 'Built on honesty alone.' },
              { n: '2nd Gen', l: 'Legacy Continues', sub: 'Son Azarudeen carries it forward.' },
            ].map(s => (
              <div key={s.l} className="p-8 sm:p-10" style={{ backgroundColor: '#1a0d08' }}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#D7B790', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.n}</div>
                <div className="text-sm font-bold mt-2 mb-1 tracking-wide" style={{ color: '#ffffff' }}>{s.l}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'rgba(184,154,122,0.55)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING QUOTE ── full-width cinematic */}
      <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0d08 0%, #2F1A0F 50%, #5a3820 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div style={{ fontSize: '8rem', lineHeight: 0.4, color: '#816047', fontFamily: 'Georgia, serif', opacity: 0.4 }}>"</div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed mt-6" style={{ color: '#E6CDB1', fontStyle: 'italic', letterSpacing: '-0.01em' }}>
            The greatest thing a father can do is show his children what integrity looks like in action — every single day.
          </p>
          <div className="mt-8 text-xs tracking-[0.3em] uppercase font-bold" style={{ color: '#816047' }}>
            Nizamudeen S.A. &nbsp;·&nbsp; Founder, Samrat Agencies &nbsp;·&nbsp; Since 1996
          </div>
        </div>
      </section>

      {/* ── CONTINUE READING ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a href="/about/azarudeen"
              className="group relative rounded-2xl overflow-hidden"
              style={{ minHeight: '260px', background: 'linear-gradient(135deg, #2F1A0F 0%, #816047 100%)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #1a0d08 0%, #5a3820 100%)' }} />
              <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#D7B790' }}>Next</p>
                  <h3 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Meet Azarudeen</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(230,205,177,0.7)' }}>
                    The son who took the legacy and built on it — with 10+ brand partnerships, 3 manufacturing units, and a 5-star reputation.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <span className="text-sm font-bold" style={{ color: '#D7B790' }}>Read His Story</span>
                  <svg className="w-4 h-4" style={{ fill: 'none', stroke: '#D7B790', strokeWidth: 2 }} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>

            <a href="/about"
              className="group relative rounded-2xl overflow-hidden"
              style={{ minHeight: '260px', backgroundColor: '#f5f0eb', border: '2px solid #D7B790' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(215,183,144,0.2)' }} />
              <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#816047' }}>Our Story</p>
                  <h3 className="text-3xl font-black mb-3" style={{ color: '#2F1A0F', letterSpacing: '-0.02em' }}>The Full Legacy</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5a3820' }}>
                    Discover the complete story of Samrat Agencies — from a small electronics shop in 1996 to Bangalore's most trusted furniture destination.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-6">
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
