'use client'

import { useEffect, useRef, useState } from 'react'

const services = [
  { name: 'HAIR', sub: 'Cut · Blowdry · Color · Balayage', img: '/images/gloria/hair/hair-01.jpg' },
  { name: 'LASHES', sub: 'Classic · Hybrid · Mega', img: '/images/gloria/lashes/lashes-01.jpg' },
  { name: 'NAILS', sub: 'Manicure · Pedicure · Gel', img: '/images/gloria/nails/nails-hero-red-v2.webp' },
  { name: 'BROWS', sub: 'Shape · Wax · Definition', img: '/images/gloria/brows/brows-01.jpg' },
]

export default function WowPreviewTwo() {
  const [entered, setEntered] = useState(false)
  const [run, setRun] = useState(0)
  const heroRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setEntered(false)
    const t = window.setTimeout(() => setEntered(true), 2450)
    return () => window.clearTimeout(t)
  }, [run])

  useEffect(() => {
    const node = heroRef.current
    if (!node) return
    const move = (e: PointerEvent) => {
      const r = node.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - .5
      const y = (e.clientY - r.top) / r.height - .5
      node.style.setProperty('--mx', String(x))
      node.style.setProperty('--my', String(y))
    }
    node.addEventListener('pointermove', move)
    return () => node.removeEventListener('pointermove', move)
  }, [])

  return (
    <main className="gloria-wow">
      <section className={`opening ${entered ? 'opening--done' : ''}`} key={run}>
        <div className="opening-noise" />
        <div className="opening-line opening-line-a" />
        <div className="opening-line opening-line-b" />
        <div className="opening-center">
          <p className="opening-kicker">MIAMI · BEAUTY · SINCE 1999</p>
          <img src="/images/gloria/logo/gloria-logo.png" alt="Gloria Beauty Salon" className="opening-logo" />
          <div className="opening-rule" />
          <p className="opening-manifesto">beauty is personal</p>
        </div>
        <div className="curtain curtain-left" />
        <div className="curtain curtain-right" />
      </section>

      <div className={`page ${entered ? 'page--in' : ''}`}>
        <header className="topbar">
          <img src="/images/gloria/logo/gloria-logo.png" alt="Gloria Beauty Salon" className="brand" />
          <nav>
            <a href="#services">Servicios</a>
            <a href="#dna">Beauty DNA</a>
            <a href="#about">Nosotros</a>
            <a href="#contact">Contacto</a>
          </nav>
          <button className="book">RESERVAR CITA <span>↗</span></button>
        </header>

        <section className="hero" ref={heroRef}>
          <div className="hero-ghost">GLORIA</div>
          <div className="hero-copy">
            <div className="eyebrow"><span />MIAMI BEAUTY HOUSE</div>
            <h1><em>Beauty</em><br/>with character.</h1>
            <p>No buscamos cambiarte. Diseñamos cada detalle alrededor de ti — cabello, color, mirada, uñas y glow.</p>
            <div className="hero-actions">
              <button className="primary">Reservar cita</button>
              <button className="quiet">Explorar servicios <span>→</span></button>
            </div>
          </div>

          <div className="hero-image-shell">
            <div className="hero-image-kinetic">
              <img className="hero-img" src="/images/gloria/hero/hero-01.jpg" alt="Gloria Beauty Salon" />
              <img className="hair-layer" src="/images/gloria/hero/hero-01.jpg" alt="" aria-hidden="true" />
            </div>
            <div className="light-sweep" />
            <div className="frame-line" />
            <p className="vertical-note">REAL WOMEN · REAL STYLE · MIAMI</p>
          </div>

          <div className="liquid-orb orb-a" /><div className="liquid-orb orb-b" />
          <svg className="signature-line" viewBox="0 0 650 190" aria-hidden="true"><path d="M8 130 C 110 18, 190 190, 310 92 S 505 5, 640 84" /></svg>
        </section>

        <section className="statement">
          <p>NOT JUST A SALON</p>
          <h2>Una experiencia editorial<br/>hecha <i>personal.</i></h2>
          <div className="statement-meta"><span>HAIR</span><span>NAILS</span><span>LASHES</span><span>BROWS</span><span>SPRAY TAN</span></div>
        </section>

        <section className="services" id="services">
          <div className="section-head"><span>01</span><h3>SERVICIOS</h3><p>Move slowly. Look closer.</p></div>
          <div className="service-stage">
            {services.map((s, i) => (
              <article className={`service service-${i + 1}`} key={s.name}>
                <div className="service-media"><img src={s.img} alt={s.name} /><div className="service-shine" /></div>
                <div className="service-caption"><span>0{i + 1}</span><h4>{s.name}</h4><p>{s.sub}</p><b>↗</b></div>
              </article>
            ))}
          </div>
        </section>

        <section className="dna" id="dna">
          <div className="dna-ribbon">YOUR BEAUTY · YOUR DATA · YOUR LOOK · YOUR BEAUTY · YOUR DATA · YOUR LOOK ·</div>
          <div className="dna-inner">
            <div className="dna-copy"><span>02 — BEAUTY DNA</span><h2>The salon<br/>that <i>remembers</i><br/>your beauty.</h2><p>Tu historial, tus preferencias, tus tonos y tus resultados viven contigo. Una experiencia que aprende de cada visita.</p><button>DESCUBRIR BEAUTY DNA ↗</button></div>
            <div className="dna-art">
              <img src="/images/gloria/makeup/makeup-01.jpg" alt="Beauty detail" />
              <div className="glass-card"><small>YOUR BEAUTY PROFILE</small><strong>01 / Hair</strong><strong>02 / Nails</strong><strong>03 / Lashes</strong><strong>04 / Brows</strong></div>
              <div className="serum-drop" />
            </div>
          </div>
        </section>

        <section className="finale" id="contact">
          <img src="/images/gloria/logo/gloria-logo.png" alt="Gloria Beauty Salon" />
          <h2>Make beauty<br/><i>feel like you.</i></h2>
          <button>RESERVAR CITA ↗</button>
          <div className="footer-meta"><span>1130 SW 8th St · Miami, FL 33130</span><span>Tue—Sat · 9AM—5PM</span><span>@gloriabeautysalon_</span></div>
        </section>
      </div>

      <button className="replay" onClick={() => setRun(v => v + 1)}>↻ REPLAY</button>

      <style jsx global>{`
        *{box-sizing:border-box}html{scroll-behavior:smooth}html,body{margin:0;background:#f4ede6;color:#2c211c}body{font-family:Arial,Helvetica,sans-serif}.gloria-wow{overflow:hidden}.page{opacity:0;transform:scale(1.012);filter:blur(8px);transition:opacity 1s ease,transform 1.4s cubic-bezier(.16,1,.3,1),filter 1.1s ease}.page--in{opacity:1;transform:none;filter:none}
        .opening{position:fixed;inset:0;z-index:5000;background:#211814;overflow:hidden;display:grid;place-items:center;transition:opacity .7s ease,visibility .7s}.opening--done{opacity:0;visibility:hidden;pointer-events:none}.opening-noise{position:absolute;inset:0;opacity:.1;background-image:radial-gradient(#fff .5px,transparent .6px);background-size:5px 5px;mix-blend-mode:soft-light}.opening-center{position:relative;z-index:4;text-align:center;color:#efe4d9}.opening-kicker{font-size:9px;letter-spacing:.42em;margin-bottom:24px;opacity:0;animation:fade .5s .2s forwards}.opening-logo{width:min(220px,42vw);filter:brightness(0) invert(1) sepia(.15);opacity:0;transform:scale(.96);animation:logoReveal .8s .45s forwards}.opening-rule{width:0;height:1px;background:#b89479;margin:26px auto 17px;animation:rule 1s .8s forwards}.opening-manifesto{font-family:Georgia,serif;font-style:italic;font-size:clamp(20px,2.4vw,31px);margin:0;opacity:0;animation:fade .65s 1.05s forwards}.opening-line{position:absolute;background:#8d6b58;opacity:.28}.opening-line-a{width:1px;height:0;left:7%;top:0;animation:vline 1.1s .2s forwards}.opening-line-b{height:1px;width:0;right:0;bottom:10%;animation:hline 1.1s .5s forwards}.curtain{position:absolute;top:0;bottom:0;width:52%;z-index:5;background:linear-gradient(90deg,#271b16,#1d1411);animation:curtainOpen 1.05s 1.58s cubic-bezier(.76,0,.24,1) forwards}.curtain-left{left:0;transform-origin:left}.curtain-right{right:0;transform-origin:right;background:linear-gradient(90deg,#1d1411,#271b16)}
        @keyframes fade{to{opacity:1}}@keyframes logoReveal{to{opacity:.94;transform:none}}@keyframes rule{to{width:118px}}@keyframes vline{to{height:100%}}@keyframes hline{to{width:100%}}@keyframes curtainOpen{to{transform:scaleX(0)}}
        .topbar{height:86px;position:absolute;top:0;left:0;right:0;z-index:20;display:grid;grid-template-columns:170px 1fr auto;align-items:center;padding:0 4vw;border-bottom:1px solid rgba(56,38,28,.11);background:rgba(245,239,233,.64);backdrop-filter:blur(16px)}.brand{width:132px;height:65px;object-fit:contain;mix-blend-mode:multiply}.topbar nav{display:flex;justify-content:center;gap:34px}.topbar a{text-decoration:none;color:#3f2f27;font-size:11px;letter-spacing:.13em;text-transform:uppercase}.book,.primary,.dna-copy button,.finale button{border:0;background:#2d211b;color:#f8eee7;border-radius:999px;padding:14px 21px;font-size:10px;letter-spacing:.16em;cursor:pointer}.book span{margin-left:12px}
        .hero{--mx:0;--my:0;min-height:100svh;position:relative;display:grid;grid-template-columns:.9fr 1.1fr;align-items:center;padding:116px 4vw 32px;background:radial-gradient(circle at 12% 28%,#fffaf5 0,transparent 35%),linear-gradient(120deg,#f5efe9 0%,#eee0d5 54%,#d9c2b4 100%);overflow:hidden}.hero-ghost{position:absolute;left:-2vw;bottom:-5vw;font-family:Georgia,serif;font-size:19vw;line-height:.8;color:rgba(73,47,35,.045);letter-spacing:-.08em;pointer-events:none;white-space:nowrap}.hero-copy{z-index:5;padding-left:4vw;transform:translate(calc(var(--mx)*-8px),calc(var(--my)*-5px));transition:transform .18s ease-out}.eyebrow{display:flex;align-items:center;gap:12px;font-size:10px;letter-spacing:.31em;color:#735a4d;margin-bottom:24px}.eyebrow span{width:44px;height:1px;background:#9e7c68}.hero h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(62px,7vw,112px);line-height:.84;letter-spacing:-.065em;font-weight:400;margin:0;color:#30221c}.hero h1 em{font-weight:400;color:#8f6754}.hero-copy>p{font-family:Georgia,serif;font-size:17px;line-height:1.68;max-width:480px;color:#70584c;margin:30px 0 31px}.hero-actions{display:flex;gap:22px;align-items:center}.quiet{border:0;background:transparent;color:#3f2f27;font-size:11px;letter-spacing:.11em;text-transform:uppercase;padding:12px 0;border-bottom:1px solid #9f8271}.quiet span{margin-left:15px}.hero-image-shell{height:min(78svh,790px);position:relative;z-index:4;overflow:hidden;border-radius:240px 0 0 240px;box-shadow:0 42px 90px rgba(69,42,28,.18);transform:translate(calc(var(--mx)*10px),calc(var(--my)*6px));transition:transform .2s ease-out}.hero-image-kinetic{position:absolute;inset:-3%;animation:breath 8s ease-in-out infinite alternate}.hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}.hair-layer{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;clip-path:polygon(3% 2%,59% 0,66% 100%,0 100%);filter:saturate(1.08) contrast(1.02);mix-blend-mode:normal;animation:hairFloat 5.5s ease-in-out infinite alternate;transform-origin:55% 46%}.light-sweep{position:absolute;top:-20%;left:-35%;width:33%;height:140%;background:linear-gradient(90deg,transparent,rgba(255,245,225,.29),transparent);transform:rotate(12deg);filter:blur(7px);animation:sweep 7.4s 1s ease-in-out infinite}.frame-line{position:absolute;inset:18px;border:1px solid rgba(255,255,255,.38);border-radius:220px 0 0 220px;pointer-events:none}.vertical-note{position:absolute;right:12px;top:50%;transform:translateY(-50%) rotate(90deg);transform-origin:center;font-size:8px;letter-spacing:.28em;color:rgba(255,255,255,.82)}@keyframes breath{to{transform:scale(1.035) translate(-5px,-3px)}}@keyframes hairFloat{0%{transform:scale(1.018) translateX(0) rotate(.01deg)}100%{transform:scale(1.035) translateX(-7px) rotate(-.25deg)}}@keyframes sweep{0%,35%{left:-35%;opacity:0}55%{opacity:1}80%,100%{left:115%;opacity:0}}
        .liquid-orb{position:absolute;border-radius:50%;background:radial-gradient(circle at 33% 27%,rgba(255,255,255,.92),rgba(218,190,174,.56) 38%,rgba(166,124,102,.16) 71%,rgba(255,255,255,.1));box-shadow:inset -10px -14px 18px rgba(103,68,52,.08),0 13px 40px rgba(90,55,38,.08);backdrop-filter:blur(2px);z-index:6}.orb-a{width:72px;height:72px;left:46%;top:22%;animation:orb 5s ease-in-out infinite alternate}.orb-b{width:30px;height:30px;left:48%;top:32%;animation:orb 4s .5s ease-in-out infinite alternate-reverse}@keyframes orb{to{transform:translateY(-13px) translateX(7px)}}.signature-line{position:absolute;left:14%;bottom:4%;width:34vw;z-index:2;opacity:.23}.signature-line path{fill:none;stroke:#8f6b59;stroke-width:1.2;stroke-dasharray:900;stroke-dashoffset:900;animation:draw 2s 2.8s forwards}@keyframes draw{to{stroke-dashoffset:0}}
        .statement{padding:140px 8vw;background:#241a16;color:#f2e7de;text-align:center;position:relative}.statement>p{font-size:9px;letter-spacing:.5em;color:#b99a86}.statement h2{font-family:Georgia,serif;font-weight:400;font-size:clamp(56px,7vw,108px);line-height:.88;letter-spacing:-.055em;margin:26px 0 60px}.statement h2 i{color:#c8a18b;font-weight:400}.statement-meta{display:flex;justify-content:center;gap:clamp(18px,5vw,75px);font-size:9px;letter-spacing:.23em;color:#bca799}
        .services{padding:105px 5vw 140px;background:#f6f0ea}.section-head{display:grid;grid-template-columns:45px 1fr auto;align-items:center;border-top:1px solid #bfa99b;padding-top:15px;margin-bottom:58px}.section-head span,.section-head h3,.section-head p{font-size:9px;letter-spacing:.22em;margin:0}.section-head h3{font-weight:500}.section-head p{font-family:Georgia,serif;font-style:italic;font-size:14px;letter-spacing:0;color:#81695b}.service-stage{display:grid;grid-template-columns:1.25fr .75fr 1fr;grid-template-rows:390px 270px;gap:18px}.service{position:relative;overflow:hidden;background:#ded0c7}.service-1{grid-row:1/3}.service-2{grid-column:2;grid-row:1}.service-3{grid-column:3;grid-row:1/3}.service-4{grid-column:2;grid-row:2}.service-media{position:absolute;inset:0;overflow:hidden}.service-media img{width:100%;height:100%;object-fit:cover;transition:transform 1.1s cubic-bezier(.16,1,.3,1),filter .8s}.service:hover .service-media img{transform:scale(1.055);filter:saturate(.92)}.service-shine{position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.2),transparent 68%);transform:translateX(-100%);transition:transform 1s}.service:hover .service-shine{transform:translateX(100%)}.service-caption{position:absolute;left:0;right:0;bottom:0;padding:20px;background:linear-gradient(180deg,transparent,rgba(29,20,16,.78));color:#fff;display:grid;grid-template-columns:32px 1fr auto;align-items:end}.service-caption span{font-size:8px;opacity:.7}.service-caption h4{font-family:Georgia,serif;font-size:28px;font-weight:400;margin:0}.service-caption p{grid-column:2;font-size:10px;letter-spacing:.08em;margin:5px 0 0;opacity:.82}.service-caption b{grid-column:3;grid-row:1/3;font-weight:400;font-size:22px}
        .dna{background:#d9c4b7;overflow:hidden}.dna-ribbon{white-space:nowrap;border-top:1px solid rgba(61,39,29,.28);border-bottom:1px solid rgba(61,39,29,.28);padding:13px 0;font-size:9px;letter-spacing:.38em;animation:ribbon 22s linear infinite}@keyframes ribbon{to{transform:translateX(-45%)}}.dna-inner{min-height:730px;display:grid;grid-template-columns:1fr 1fr}.dna-copy{padding:100px 7vw;display:flex;flex-direction:column;justify-content:center}.dna-copy>span{font-size:9px;letter-spacing:.25em}.dna-copy h2{font-family:Georgia,serif;font-weight:400;font-size:clamp(55px,6vw,92px);line-height:.88;letter-spacing:-.055em;margin:25px 0}.dna-copy h2 i{font-weight:400;color:#805944}.dna-copy p{font-family:Georgia,serif;font-size:16px;line-height:1.7;max-width:480px;color:#5e463b}.dna-copy button{align-self:flex-start;margin-top:26px}.dna-art{position:relative;min-height:730px;overflow:hidden}.dna-art>img{position:absolute;inset:6% 7% 6% 0;width:93%;height:88%;object-fit:cover;border-radius:220px 0 0 0}.glass-card{position:absolute;left:-65px;bottom:80px;width:265px;padding:22px 24px;background:rgba(248,240,234,.69);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.48);box-shadow:0 25px 65px rgba(67,42,30,.13);display:flex;flex-direction:column;gap:12px}.glass-card small{font-size:8px;letter-spacing:.22em;margin-bottom:7px}.glass-card strong{font-family:Georgia,serif;font-size:17px;font-weight:400;border-top:1px solid rgba(87,58,43,.14);padding-top:9px}.serum-drop{position:absolute;width:92px;height:92px;border-radius:50%;right:10%;top:9%;background:radial-gradient(circle at 30% 25%,#fff 0 7%,rgba(255,255,255,.55) 8% 17%,rgba(211,173,152,.38) 48%,rgba(122,82,62,.12));box-shadow:inset -14px -12px 20px rgba(93,59,43,.12)}
        .finale{min-height:85vh;background:#f7f2ed;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px 5vw}.finale>img{width:150px;mix-blend-mode:multiply;margin-bottom:30px}.finale h2{font-family:Georgia,serif;font-size:clamp(65px,8vw,120px);line-height:.84;letter-spacing:-.06em;font-weight:400;margin:0 0 38px}.finale h2 i{font-weight:400;color:#a67961}.footer-meta{width:100%;display:flex;justify-content:space-between;border-top:1px solid #cbb8ad;margin-top:95px;padding-top:15px;font-size:9px;letter-spacing:.14em}.replay{position:fixed;right:16px;bottom:16px;z-index:6000;border:1px solid rgba(54,37,28,.18);background:rgba(249,244,239,.85);backdrop-filter:blur(12px);border-radius:999px;padding:10px 14px;color:#443128;font-size:9px;letter-spacing:.18em;cursor:pointer}
        @media(max-width:900px){.topbar{height:72px;grid-template-columns:1fr auto;padding:0 18px}.brand{width:105px;height:55px}.topbar nav{display:none}.book{padding:11px 14px}.hero{grid-template-columns:1fr;min-height:auto;padding:98px 16px 18px}.hero-copy{padding:25px 9px 42px}.hero h1{font-size:62px}.hero-image-shell{height:64svh;min-height:500px;border-radius:180px 180px 24px 24px}.frame-line{border-radius:170px 170px 18px 18px}.hero-ghost{font-size:34vw;bottom:49%}.liquid-orb{display:none}.signature-line{width:70vw;left:5%;bottom:48%}.statement{padding:100px 20px}.statement-meta{flex-wrap:wrap}.service-stage{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:8px}.service{min-width:82vw;height:520px;scroll-snap-align:center}.section-head{grid-template-columns:32px 1fr}.section-head p{display:none}.dna-inner{grid-template-columns:1fr}.dna-copy{padding:85px 22px 40px}.dna-art{min-height:560px}.dna-art>img{inset:0 16px 0 32px;width:calc(100% - 48px);height:100%;border-radius:170px 0 0 0}.glass-card{left:14px;bottom:26px}.footer-meta{flex-direction:column;gap:10px;align-items:center}.finale{min-height:75vh}.finale h2{font-size:65px}}
        @media(max-width:520px){.hero h1{font-size:52px}.hero-copy>p{font-size:15px}.hero-image-shell{min-height:460px}.service{min-width:88vw;height:470px}.dna-copy h2{font-size:58px}.opening-kicker{letter-spacing:.24em}.opening-logo{width:170px}.finale h2{font-size:57px}.topbar .book{font-size:8px}.statement h2{font-size:58px}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
      `}</style>
    </main>
  )
}
