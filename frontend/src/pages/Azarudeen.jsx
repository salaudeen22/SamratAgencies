import { Helmet } from 'react-helmet-async';

const Azarudeen = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
      <Helmet>
        <title>Azarudeen – Owner & Leader of Samrat Agencies Bangalore</title>
        <meta name="description" content="Meet Azarudeen, the owner and driving force behind Samrat Agencies. Leading Bangalore's most trusted furniture and mattress store since 2015 with 5-star excellence." />
        <meta name="keywords" content="Azarudeen Samrat Agencies, Azarudeen furniture Bangalore, Azarudeen mattress store Hongasandra, Samrat Agencies owner Bangalore" />
        <meta property="og:title" content="Azarudeen – Owner of Samrat Agencies Bangalore" />
        <meta property="og:description" content="Meet Azarudeen, the face of Samrat Agencies. Building on a legacy started in 1996, he has grown Samrat Agencies into Bangalore's premier furniture destination." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://samratagencies.in/about/azarudeen" />
        <meta property="og:image" content="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_lprobylprobylpro.png" />
        <meta property="profile:first_name" content="Azarudeen" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Azarudeen – Owner of Samrat Agencies Bangalore" />
        <meta name="twitter:image" content="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_lprobylprobylpro.png" />
        <link rel="canonical" href="https://samratagencies.in/about/azarudeen" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Azarudeen, Samrat Agencies" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://samratagencies.in/about/azarudeen#person",
            "name": "Azarudeen",
            "jobTitle": "Owner & Managing Director",
            "description": "Azarudeen is the owner and managing director of Samrat Agencies, Bangalore's premier furniture and mattress store. Taking over from his father Nizamudeen S.A. in 2015, he has expanded the business with 10+ brand partnerships and 3 manufacturing units.",
            "image": "https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_lprobylprobylpro.png",
            "url": "https://samratagencies.in/about/azarudeen",
            "knowsAbout": ["Furniture", "Mattresses", "Home Furnishing", "Retail", "Manufacturing"],
            "worksFor": {
              "@type": "LocalBusiness",
              "name": "Samrat Agencies",
              "url": "https://samratagencies.in",
              "telephone": "+919880914457",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Babu Reddy Complex, 5, Begur Main Road, Hongasandra",
                "addressLocality": "Bengaluru",
                "addressRegion": "Karnataka",
                "postalCode": "560114",
                "addressCountry": "IN"
              }
            }
          }
        `}</script>
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative flex items-end overflow-hidden"
        style={{ minHeight: '100svh', background: 'linear-gradient(160deg, #0d0705 0%, #1a0d08 40%, #2F1A0F 100%)' }}>

        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(ellipse at 70% 50%, rgba(129,96,71,0.15) 0%, transparent 70%)`
        }} />

        {/* Photo — full-width on mobile, right-half on desktop */}
        <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[52%] overflow-hidden">
          <img
            src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_lprobylprobylpro.png"
            alt="Azarudeen – Owner, Samrat Agencies Bangalore"
            className="w-full h-full object-cover object-top"
            style={{ filter: 'brightness(0.4) saturate(0.7)' }}
          />
          {/* On mobile: heavy bottom fade + top fade. On desktop: left fade only */}
          <div className="absolute inset-0 lg:hidden" style={{
            background: 'linear-gradient(to top, #0d0705 35%, rgba(13,7,5,0.7) 60%, rgba(13,7,5,0.5) 100%)'
          }} />
          <div className="absolute inset-0 hidden lg:block" style={{
            background: 'linear-gradient(to right, #0d0705 0%, rgba(13,7,5,0.8) 25%, transparent 65%), linear-gradient(to top, #0d0705 0%, transparent 50%)'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 pb-12 pt-28 sm:pt-36 lg:pb-20">
          <div className="max-w-xl lg:max-w-2xl">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-5" style={{ color: '#816047' }}>
              Samrat Agencies · Est. 1996 · Bangalore
            </p>
            <h1 style={{
              fontSize: 'clamp(2.8rem, 10vw, 6.5rem)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              textTransform: 'uppercase'
            }}>
              Azarudeen
            </h1>
            <div style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: '#D7B790',
              marginTop: '0.4rem',
              textTransform: 'uppercase'
            }}>
              Owner &amp; Managing Director
            </div>
            <div className="w-16 h-px mt-5 mb-5" style={{ backgroundColor: '#816047' }} />
            <p className="text-sm sm:text-base leading-relaxed max-w-md" style={{ color: '#b89a7a' }}>
              The man who took his father's 1996 dream and built it into Bangalore's most trusted furniture and mattress destination.
            </p>

            {/* Stats — 2×2 on mobile, 4 across on sm+ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-8">
              {[
                { n: '10+', l: 'Brand Partnerships' },
                { n: '3', l: 'Manufacturing Units' },
                { n: '5.0', l: 'Google Rating' },
                { n: '30+', l: 'Years of Legacy' },
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

      {/* ── PULL QUOTE ── */}
      <section style={{ backgroundColor: '#2F1A0F' }} className="py-12 sm:py-16 px-5 sm:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <div style={{ fontSize: '5rem', lineHeight: 0.5, color: '#816047', fontFamily: 'Georgia, serif', opacity: 0.5 }}>"</div>
          <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mt-4" style={{ color: '#E6CDB1', fontStyle: 'italic' }}>
            My father taught me that business isn't about transactions — it's about relationships that last generations.
          </blockquote>
          <div className="mt-5 text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: '#816047' }}>
            Azarudeen · Owner, Samrat Agencies
          </div>
        </div>
      </section>

      {/* ── EDITORIAL PROFILE ── */}
      <section className="py-14 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">

          {/* Section label — visible on all sizes */}
          <div className="flex items-center gap-4 mb-10">
            <div className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#816047' }}>Profile</div>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(129,96,71,0.2)' }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

            {/* Watermark — desktop only */}
            <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
              <div style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                fontSize: '4rem',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: 'rgba(129,96,71,0.08)',
                lineHeight: 1,
                userSelect: 'none',
              }}>AZARUDEEN</div>
            </div>

            <div className="lg:col-span-9">
              {/* Two-col text on md+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5" style={{ color: '#2F1A0F', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                    The man behind every five-star review.
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: '#5a3820' }}>
                    Azarudeen didn't inherit just a business — he inherited a responsibility. Thousands of Bangalore families had placed their trust in the Samrat name over decades. When he stepped into leadership in 2015, his first act wasn't expansion. It was listening.
                  </p>
                </div>
                <div className="flex flex-col justify-end gap-5">
                  <p className="text-base leading-relaxed" style={{ color: '#5a3820' }}>
                    He spent months visiting long-time customers, asking what they loved, what they wished was better, what kept them coming back. Only after understanding that foundation did he begin to build on it.
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: '#5a3820' }}>
                    Today, customers walk in and ask for Azar by name. Not because of marketing — because of the consistent, unhurried, genuine attention he gives every single person who walks through the door.
                  </p>
                </div>
              </div>

              {/* Photo */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img
                  src="https://samrat-agencies.s3.ap-south-1.amazonaws.com/Gemini_Generated_Image_lprobylprobylpro.png"
                  alt="Azarudeen at Samrat Agencies showroom"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(47,26,15,0.9) 0%, transparent 55%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <p className="text-white font-bold text-base sm:text-lg">Azarudeen</p>
                  <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: '#D7B790' }}>Owner & Managing Director · Since 2015</p>
                </div>
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                  style={{ backgroundColor: 'rgba(215,183,144,0.2)', border: '1px solid #D7B790', color: '#D7B790' }}>
                  2nd Generation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY CHAPTERS ── */}
      <section style={{ backgroundColor: '#f5f0eb' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="text-center py-12 sm:py-16">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#816047' }}>In His Own Words</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ color: '#2F1A0F', letterSpacing: '-0.02em' }}>The Making of a Leader</h2>
          </div>

          {[
            { chapter: '01', title: 'Growing Up Inside the Business', aside: 'Absorbed every lesson before being formally taught any of them.', body: `Azarudeen didn't wake up one day and decide to run a furniture business. He grew up inside it. As a child, he watched his father Mr. Nizamudeen greet every customer by name, spend hours helping a family choose the right mattress, and never once rush a sale. That environment shaped him profoundly. By the time he was old enough to take over, he didn't just know the business — he understood its soul.` },
            { chapter: '02', title: 'Taking the Reins in 2015', aside: 'Listened before he led. That discipline separated him from the start.', body: `In 2015, Azarudeen formally stepped in as managing director. His first priority wasn't expansion — it was preservation. He spent months talking to long-time customers, understanding what they loved, what they wished was better, and what made them keep coming back. Only then did he begin to grow. That customer-first approach has defined every major decision since.` },
            { chapter: '03', title: 'Building Partnerships That Mean Something', aside: "Authorised dealer for 10+ of India's most trusted names.", body: `His philosophy on brand partnerships is simple: "I will only sell what I would put in my own home." That is why Samrat Agencies carries Sleepwell, Duroflex, Nilkamal, Kurl-on, Peps, Repose, Centuary, Restolex, Wakefit, and Hypnos — not just any brands, but the ones that consistently deliver on their promises.` },
            { chapter: '04', title: 'Manufacturing — Control from the Ground Up', aside: '3 units. Every piece controlled from raw material to delivery.', body: `One of Azarudeen's most defining decisions was opening manufacturing units in Jigani, Hongasandra, and Lakkasandra. By controlling manufacturing, Samrat Agencies guarantees the quality of every joint, every finish, every piece that goes into a customer's home. Skilled craftsmen — many of whom have been with the company for years — build furniture that is meant to be passed down.` },
            { chapter: '05', title: 'The Azar Way', aside: 'Hundreds of reviews mention Azar by name. That is not accidental.', body: `Ask any customer who has dealt with Azarudeen, and they will tell you the same thing: he listens. He does not push products — he asks questions. What is the size of your room? Who will be sleeping on this mattress? Do you prefer firm or soft support? He takes the time to understand your home before he recommends anything for it.` },
          ].map((item, i) => (
            <div key={item.chapter}
              className={`py-8 sm:py-10 ${i < 4 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(129,96,71,0.15)' }}>
              {/* On mobile: stacked. On lg: 3-column grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                {/* Chapter number — desktop only */}
                <div className="hidden lg:flex lg:col-span-1 items-start">
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: 'rgba(129,96,71,0.15)', lineHeight: 1 }}>{item.chapter}</span>
                </div>
                {/* Body */}
                <div className="lg:col-span-7">
                  {/* On mobile, show chapter number inline with title */}
                  <div className="flex items-baseline gap-3 mb-3 lg:block">
                    <span className="text-xs font-black tracking-widest lg:hidden" style={{ color: 'rgba(129,96,71,0.4)' }}>{item.chapter}</span>
                    <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#2F1A0F', letterSpacing: '-0.01em' }}>{item.title}</h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#5a3820' }}>{item.body}</p>
                </div>
                {/* Aside — top border on mobile, left border on desktop */}
                <div className="lg:col-span-4 border-t-2 pt-4 lg:border-t-0 lg:border-l-2 lg:pl-8 lg:pt-0"
                  style={{ borderColor: 'rgba(129,96,71,0.2)' }}>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(129,96,71,0.7)' }}>{item.aside}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT HE BUILT ── */}
      <section className="py-14 sm:py-20 lg:py-24" style={{ backgroundColor: '#1a0d08' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-4">
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#816047' }}>By the Numbers</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
                What Azarudeen<br />Has Built
              </h2>
              <div className="w-16 h-px mt-5" style={{ backgroundColor: '#816047' }} />
              <p className="mt-5 text-sm sm:text-base leading-relaxed" style={{ color: '#b89a7a' }}>
                Numbers tell part of the story. The other part is told by every family who has trusted Samrat Agencies with their home.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(129,96,71,0.2)' }}>
              {[
                { n: '10+', l: 'Brand Partnerships', sub: "India's most trusted names, personally vetted." },
                { n: '3', l: 'Manufacturing Units', sub: 'Jigani · Hongasandra · Lakkasandra.' },
                { n: '5.0', l: 'Google Rating', sub: 'Hundreds of reviews. Consistently perfect.' },
                { n: '1Cr+', l: 'Customers Served', sub: '30 years of Samrat legacy across Bangalore.' },
              ].map(s => (
                <div key={s.l} className="p-6 sm:p-8 lg:p-10" style={{ backgroundColor: '#1a0d08' }}>
                  <div style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, color: '#D7B790', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.n}</div>
                  <div className="text-xs sm:text-sm font-bold mt-2 mb-1 tracking-wide" style={{ color: '#ffffff' }}>{s.l}</div>
                  <div className="text-xs leading-relaxed hidden sm:block" style={{ color: 'rgba(184,154,122,0.6)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-14 sm:py-20 lg:py-24" style={{ backgroundColor: '#fafaf9' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="mb-10 sm:mb-14">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#816047' }}>Core Principles</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ color: '#2F1A0F', letterSpacing: '-0.02em' }}>
              What Azarudeen believes<br className="hidden sm:block" /> about business.
            </h2>
          </div>

          <div>
            {[
              { num: 'I', title: 'Honesty Over Everything', body: 'Azarudeen will tell you if a product is not right for you — even if it means a smaller sale. He has walked customers to competitors when they genuinely needed something Samrat did not carry. That honesty is exactly why those same customers come back, and bring their families.' },
              { num: 'II', title: 'Quality You Can Feel', body: 'He personally reviews every brand and every product before it enters the showroom. He sits on the sofas, tests the mattresses, inspects the finishes. If he would not put it in his own home, it does not go on the floor. That standard has never been negotiated.' },
              { num: 'III', title: 'Service That Goes Beyond the Sale', body: 'The relationship does not end at delivery. Azarudeen and his team follow up, handle concerns, and stand behind everything they sell — not because policy demands it, but because that is simply how they believe business should be done.' },
            ].map((v) => (
              <div key={v.num}
                className="py-7 sm:py-10 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6"
                style={{ borderTop: '1px solid rgba(129,96,71,0.2)' }}>
                <div className="sm:col-span-1 flex items-start gap-3 sm:block">
                  <span className="text-xs font-black" style={{ color: 'rgba(129,96,71,0.4)' }}>{v.num}</span>
                  {/* On mobile, show title next to number */}
                  <h3 className="text-lg font-bold sm:hidden" style={{ color: '#2F1A0F' }}>{v.title}</h3>
                </div>
                <div className="sm:col-span-4 hidden sm:block">
                  <h3 className="text-xl font-bold" style={{ color: '#2F1A0F' }}>{v.title}</h3>
                </div>
                <div className="sm:col-span-7">
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#5a3820' }}>{v.body}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(129,96,71,0.2)' }} />
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-14 sm:py-20 lg:py-24" style={{ backgroundColor: '#2F1A0F' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#816047' }}>Customer Voices</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
              What Customers Say<br />About Azarudeen
            </h2>
          </div>

          {/* Featured review */}
          <div className="mb-8 p-7 sm:p-10 lg:p-14 rounded-xl sm:rounded-2xl" style={{ backgroundColor: 'rgba(215,183,144,0.07)', border: '1px solid rgba(215,183,144,0.15)' }}>
            <div style={{ fontSize: '4rem', lineHeight: 0.6, color: '#816047', fontFamily: 'Georgia, serif', opacity: 0.6 }}>"</div>
            <p className="text-base sm:text-xl lg:text-2xl leading-relaxed mt-3 font-light" style={{ color: '#E6CDB1' }}>
              The owner's behavior is awesome. I ordered a sofa which required to be built. The owner sent a temporary sofa to my home for the intermediate time so that I have a place to sit. This is a commendable act.
            </p>
            <div className="flex flex-wrap items-center mt-6 gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ backgroundColor: '#816047', color: '#fff' }}>KT</div>
              <div>
                <div className="font-bold text-sm sm:text-base" style={{ color: '#ffffff' }}>Kumuda T</div>
                <div className="text-xs tracking-widest uppercase" style={{ color: '#816047' }}>Verified Google Review</div>
              </div>
              <div className="flex gap-1 sm:ml-auto">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" style={{ fill: '#D7B790' }} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Review grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { initials: 'SR', name: 'Shiva Reddy', text: 'I would thank Mr. Azar for assisting us throughout and explaining about the product clearly. Overall, a great experience — I will definitely shop here again.' },
              { initials: 'YS', name: 'Yamuna Sharma', text: 'I would especially like to thank Azar for assisting us throughout. He was extremely patient, polite, and answered all our queries clearly. The delivery was completely hassle-free.' },
              { initials: 'NR', name: 'Nithin Reddy', text: 'We were greeted by Mr. Azar, a cheerful and knowledgeable executive. He patiently guided us through the showroom and was incredibly supportive throughout.' },
              { initials: 'DP', name: 'Deepak Pandey', text: 'The way the owner explains every product in detail made it easy to choose the right one. We are very happy with our purchase and would recommend Samrat Agencies to everyone.' },
              { initials: 'RK', name: 'Rekha Kumar', text: 'I have visited many furniture stores in Bangalore but none match the personal touch at Samrat Agencies. Azar remembers your preferences and never makes you feel rushed.' },
              { initials: 'SS', name: 'Sunny Singh', text: 'Samrat Agencies has exceptional products and extremely supportive staff. Azar personally made sure everything was perfect before delivery. Highly recommend.' },
            ].map(r => (
              <div key={r.name} className="p-6 sm:p-7 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(215,183,144,0.12)' }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5" style={{ fill: '#D7B790' }} viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(230,205,177,0.8)' }}>"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: 'rgba(129,96,71,0.4)', color: '#D7B790' }}>{r.initials}</div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#E6CDB1' }}>{r.name}</div>
                    <div className="text-xs" style={{ color: 'rgba(184,154,122,0.5)' }}>Google Review</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: '#816047' }}>Visit the Showroom</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5" style={{ color: '#2F1A0F', letterSpacing: '-0.02em' }}>
                Come meet<br />Azarudeen<br />in person.
              </h2>
              <p className="text-sm sm:text-base leading-relaxed mb-1" style={{ color: '#5a3820' }}>
                Babu Reddy Complex, 5, Begur Main Road<br />Hongasandra, Bangalore — 560114
              </p>
              <p className="text-sm mb-7" style={{ color: 'rgba(129,96,71,0.6)' }}>Open Monday – Sunday · 8:00 AM – 10:30 PM</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a href="/contact"
                  className="inline-block px-7 py-3.5 rounded-xl text-white font-bold tracking-wide text-sm text-center transition-all hover:opacity-90"
                  style={{ backgroundColor: '#2F1A0F' }}>
                  Get in Touch
                </a>
                <a href="/about/nizamudeen"
                  className="inline-block px-7 py-3.5 rounded-xl font-bold tracking-wide text-sm text-center transition-all hover:opacity-90"
                  style={{ backgroundColor: '#E6CDB1', color: '#2F1A0F' }}>
                  Meet the Founder
                </a>
              </div>
            </div>

            <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl" style={{ border: '2px solid #D7B790' }}>
              <div className="p-6 sm:p-8" style={{ background: 'linear-gradient(135deg, #2F1A0F 0%, #5a3820 100%)' }}>
                <div className="text-xs font-bold tracking-[0.3em] uppercase mb-5" style={{ color: '#816047' }}>Samrat Agencies</div>
                <div className="space-y-4">
                  {[
                    { label: 'Address', value: 'Babu Reddy Complex, 5, Begur Main Road, Hongasandra, Bangalore 560114' },
                    { label: 'Phone', value: '+91 98809 14457' },
                    { label: 'Hours', value: 'Mon–Sun · 8:00 AM – 10:30 PM' },
                    { label: 'Est.', value: '1996 · 30+ Years of Trust' },
                  ].map(d => (
                    <div key={d.label} className="flex gap-3">
                      <div className="text-xs font-bold tracking-widest uppercase w-16 flex-shrink-0 mt-0.5" style={{ color: '#816047' }}>{d.label}</div>
                      <div className="text-sm leading-relaxed" style={{ color: '#E6CDB1' }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 bg-white">
                <a href="/about"
                  className="block text-center py-3 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-80"
                  style={{ border: '2px solid #816047', color: '#816047' }}>
                  Our Full Story
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Azarudeen;
