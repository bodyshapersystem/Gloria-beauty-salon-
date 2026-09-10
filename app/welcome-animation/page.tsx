'use client'

import { useEffect, useState } from 'react'

export default function WelcomeAnimationPreview() {
  const [run, setRun] = useState(0)
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    setIntroDone(false)
    const timer = window.setTimeout(() => setIntroDone(true), 3550)
    return () => window.clearTimeout(timer)
  }, [run])

  return (
    <main className="demo-shell">
      <div className={`intro ${introDone ? 'intro--done' : ''}`} key={run} aria-hidden={introDone}>
        <div className="intro-grain" />
        <div className="intro-logo">
          <img src="/images/gloria/logo/gloria-logo.png" alt="Gloria Beauty Salon" />
        </div>

        <div className="brush-stage">
          <svg className="paint-stroke" viewBox="0 0 900 260" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="paint" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e5cdbd" stopOpacity="0.12" />
                <stop offset="18%" stopColor="#d7b59e" stopOpacity="0.78" />
                <stop offset="52%" stopColor="#c79678" stopOpacity="0.92" />
                <stop offset="82%" stopColor="#d8b7a0" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#ecd9cc" stopOpacity="0.12" />
              </linearGradient>
              <filter id="soft" x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur stdDeviation="2.4" />
              </filter>
            </defs>
            <path className="paint-line paint-line--soft" d="M40 160 C 170 86, 310 206, 448 126 S 708 58, 860 136" />
            <path className="paint-line" d="M40 160 C 170 86, 310 206, 448 126 S 708 58, 860 136" />
            <path className="paint-detail" d="M75 171 C 207 118, 319 199, 451 140 S 708 83, 827 145" />
            <path className="paint-detail paint-detail--2" d="M92 143 C 218 98, 324 181, 451 120 S 685 74, 816 126" />
          </svg>

          <div className="brush">
            <span className="brush-handle" />
            <span className="brush-ferrule" />
            <span className="brush-bristles" />
          </div>

          <div className="welcome">Welcome</div>
          <div className="subline">to Gloria Beauty Salon</div>
        </div>

        <div className="intro-palm intro-palm--one" />
        <div className="intro-palm intro-palm--two" />
      </div>

      <section className={`site-preview ${introDone ? 'site-preview--visible' : ''}`}>
        <header className="nav">
          <img className="nav-logo" src="/images/gloria/logo/gloria-logo.png" alt="Gloria Beauty Salon" />
          <nav className="nav-links" aria-label="Demo navigation">
            <a href="#">Inicio</a>
            <a href="#services">Servicios</a>
            <a href="#">Beauty DNA</a>
            <a href="#">Galería</a>
            <a href="#">Nosotros</a>
            <a href="#">Contacto</a>
          </nav>
          <button className="book">Reservar cita <span>→</span></button>
        </header>

        <section className="hero">
          <div className="hero-art hero-art--cream" />
          <div className="hero-art hero-art--wave" />
          <div className="palm-shadow" />
          <div className="hero-copy">
            <p className="eyebrow">BELLEZA QUE TE ACOMPAÑA</p>
            <h1>Belleza elevada,<br />atención personalizada.</h1>
            <p className="lead">Un espacio creado para realzar tu esencia y definir tu estilo. Porque la verdadera belleza está en sentirte tú.</p>
            <button className="hero-cta">Reserva tu cita <span>→</span></button>
          </div>
          <div className="hero-photo-wrap">
            <img src="/images/gloria/hero/hero-01.jpg" alt="Gloria Beauty Salon hero" className="hero-photo" />
            <div className="photo-veil" />
          </div>
        </section>

        <section id="services" className="services">
          <div className="services-title">
            <p className="eyebrow">NUESTROS SERVICIOS</p>
            <h2>Belleza en cada detalle.</h2>
          </div>
          <div className="service-grid">
            <article><div className="service-img hair" /><h3>Cabello</h3><p>Estilo que te define</p></article>
            <article><div className="service-img lashes" /><h3>Pestañas</h3><p>Mirada con intención</p></article>
            <article><div className="service-img nails" /><h3>Uñas</h3><p>Detalles que inspiran</p></article>
            <article className="texture-card"><div className="cream-swipe" /><h3>Beauty Rituals</h3><p>Cuidado que se siente</p></article>
          </div>
        </section>
      </section>

      <button className="replay" onClick={() => setRun(v => v + 1)} aria-label="Reproducir animación de nuevo">
        ↻ <span>Replay intro</span>
      </button>

      <style jsx global>{`
        *{box-sizing:border-box} html,body{margin:0;background:#f7f1eb;color:#3d2b22} body{font-family:Arial,Helvetica,sans-serif}.demo-shell{min-height:100vh;overflow-x:hidden;background:#f7f1eb}.intro{position:fixed;inset:0;z-index:1000;background:linear-gradient(135deg,#fbf7f2 0%,#f3e9df 56%,#eee0d4 100%);display:grid;place-items:center;transition:opacity .72s cubic-bezier(.4,0,.2,1),visibility .72s;overflow:hidden}.intro--done{opacity:0;visibility:hidden;pointer-events:none}.intro-grain{position:absolute;inset:0;opacity:.23;background-image:radial-gradient(rgba(121,87,65,.16) .65px,transparent .65px);background-size:5px 5px;mix-blend-mode:multiply}.intro-logo{position:absolute;top:7vh;left:50%;transform:translateX(-50%);width:min(175px,32vw);opacity:0;animation:logoIn .9s 2.35s forwards}.intro-logo img{width:100%;height:auto;mix-blend-mode:multiply}.brush-stage{position:relative;width:min(900px,91vw);height:310px;display:grid;place-items:center}.paint-stroke{position:absolute;inset:0;width:100%;height:100%;overflow:visible}.paint-line{fill:none;stroke:url(#paint);stroke-width:86;stroke-linecap:round;stroke-dasharray:1130;stroke-dashoffset:1130;animation:paintDraw 1.55s .22s cubic-bezier(.42,0,.2,1) forwards}.paint-line--soft{stroke-width:106;opacity:.28;filter:url(#soft)}.paint-detail{fill:none;stroke:#f3dfd1;stroke-width:3.1;stroke-linecap:round;opacity:.9;stroke-dasharray:1080;stroke-dashoffset:1080;animation:paintDraw 1.5s .28s ease-out forwards}.paint-detail--2{opacity:.54;stroke-width:2.1}.brush{position:absolute;left:2%;top:49%;width:184px;height:42px;display:flex;align-items:center;transform:translate(-15%,-50%) rotate(-10deg);transform-origin:85% 50%;animation:brushMove 1.62s .17s cubic-bezier(.38,.02,.23,1) forwards;filter:drop-shadow(0 6px 8px rgba(74,45,31,.16))}.brush-handle{width:108px;height:12px;border-radius:12px 2px 2px 12px;background:linear-gradient(90deg,#7a503b,#b38264 72%,#c99f84)}.brush-ferrule{width:28px;height:22px;background:linear-gradient(180deg,#e7c9b3,#a56f51 46%,#d7ae92);border-radius:2px}.brush-bristles{width:48px;height:38px;clip-path:polygon(0 8%,100% 50%,0 92%);background:linear-gradient(180deg,#5a3b2c,#2e1f19 58%,#6c4938)}.welcome{position:relative;z-index:5;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:clamp(62px,11vw,132px);font-weight:400;color:#6d4734;letter-spacing:-.055em;opacity:0;clip-path:inset(0 100% 0 0);animation:welcomeReveal .85s 1.25s cubic-bezier(.16,1,.3,1) forwards;text-shadow:0 2px 14px rgba(94,62,44,.08)}.subline{position:absolute;top:71%;font-family:Georgia,'Times New Roman',serif;font-size:clamp(13px,1.4vw,18px);letter-spacing:.32em;text-transform:uppercase;color:#8b6c5b;opacity:0;animation:fadeUp .65s 1.8s forwards}.intro-palm{position:absolute;width:360px;height:580px;opacity:.08;filter:blur(2px);background:repeating-linear-gradient(72deg,transparent 0 26px,#866b5d 28px 34px,transparent 36px 58px);border-radius:70% 20% 70% 20%;transform:rotate(28deg)}.intro-palm--one{left:-90px;bottom:-220px}.intro-palm--two{right:-130px;top:-250px;transform:rotate(205deg)}
        @keyframes paintDraw{to{stroke-dashoffset:0}}@keyframes brushMove{0%{left:1%;top:56%;transform:translate(-15%,-50%) rotate(-14deg)}38%{top:42%;transform:translate(-15%,-50%) rotate(7deg)}70%{top:50%;transform:translate(-15%,-50%) rotate(-4deg)}100%{left:92%;top:47%;transform:translate(-15%,-50%) rotate(5deg);opacity:.05}}@keyframes welcomeReveal{0%{opacity:0;clip-path:inset(0 100% 0 0);transform:translateY(7px)}100%{opacity:1;clip-path:inset(0 0 0 0);transform:none}}@keyframes logoIn{to{opacity:1;transform:translateX(-50%) translateY(-4px)}}@keyframes fadeUp{to{opacity:1;transform:translateY(-6px)}}
        .site-preview{min-height:100vh;opacity:0;transform:scale(1.018);filter:blur(9px);transition:opacity .9s ease,transform 1.1s cubic-bezier(.16,1,.3,1),filter 1s ease}.site-preview--visible{opacity:1;transform:none;filter:none}.nav{height:92px;display:grid;grid-template-columns:190px 1fr auto;align-items:center;gap:34px;padding:0 clamp(26px,5vw,82px);background:rgba(251,248,244,.94);border-bottom:1px solid rgba(98,69,50,.09);position:relative;z-index:10}.nav-logo{width:145px;height:74px;object-fit:contain;mix-blend-mode:multiply}.nav-links{display:flex;justify-content:center;gap:clamp(18px,2.4vw,38px)}.nav-links a{font-size:13px;color:#49372d;text-decoration:none;letter-spacing:.025em}.book,.hero-cta{border:0;border-radius:999px;background:linear-gradient(135deg,#9d795f,#7c5742);color:#fff;padding:15px 24px;text-transform:uppercase;letter-spacing:.12em;font-size:11px;cursor:pointer;box-shadow:0 7px 19px rgba(91,59,42,.16)}.book span,.hero-cta span{margin-left:14px}.hero{position:relative;min-height:650px;display:grid;grid-template-columns:1.02fr .98fr;overflow:hidden;background:#f7f0e9}.hero-copy{z-index:3;align-self:center;padding:70px 7vw 76px 9vw;max-width:760px}.eyebrow{font-size:11px;letter-spacing:.27em;font-weight:600;color:#886a58;margin:0 0 20px}.hero h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(52px,5.4vw,84px);line-height:.94;letter-spacing:-.055em;font-weight:400;margin:0 0 28px;color:#3e2a21}.lead{font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.68;max-width:530px;color:#6a5447;margin:0 0 34px}.hero-photo-wrap{position:relative;z-index:2;min-height:650px;overflow:hidden}.hero-photo{width:100%;height:100%;position:absolute;inset:0;object-fit:cover;object-position:center}.photo-veil{position:absolute;inset:0;background:linear-gradient(90deg,#f7f0e9 0%,rgba(247,240,233,.18) 17%,transparent 42%)}.hero-art{position:absolute;z-index:1;pointer-events:none}.hero-art--cream{left:-6%;bottom:-40px;width:48%;height:175px;border-radius:50%;background:linear-gradient(165deg,rgba(255,255,255,.02),rgba(222,190,169,.36));filter:blur(.5px);transform:rotate(-6deg);box-shadow:inset 0 0 0 1px rgba(161,120,92,.08)}.hero-art--wave{right:35%;top:16%;width:260px;height:90px;border:2px solid rgba(178,135,107,.14);border-left-color:transparent;border-bottom-color:transparent;border-radius:50%;transform:rotate(26deg)}.palm-shadow{position:absolute;left:-80px;top:-95px;width:390px;height:510px;opacity:.06;background:repeating-linear-gradient(68deg,transparent 0 26px,#795f52 28px 35px,transparent 37px 60px);transform:rotate(-12deg);filter:blur(2px)}.services{padding:75px 7vw 88px;background:#fbf8f4;position:relative}.services-title{display:flex;align-items:end;justify-content:space-between;margin-bottom:34px;border-bottom:1px solid rgba(108,78,59,.16);padding-bottom:22px}.services h2{font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:clamp(36px,4vw,55px);letter-spacing:-.04em;margin:0}.service-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.service-grid article{background:#f3e9df;padding:12px 12px 18px;border-radius:4px;min-height:320px}.service-img{height:230px;background-size:cover;background-position:center}.service-img.hair{background-image:url('/images/gloria/hero/hero-01.jpg');background-position:35% 42%}.service-img.lashes{background:radial-gradient(circle at 58% 43%,#d3ad98 0 7%,#8f6250 8% 11%,#e8c6b1 12% 28%,#c8987f 29% 41%,#f1d9ca 42% 100%)}.service-img.nails{background:linear-gradient(132deg,#e8c8b8 0 24%,#f4e6de 25% 39%,#d7a992 40% 53%,#f5e7df 54% 69%,#c89278 70% 81%,#ead7cd 82%)}.service-grid h3{font-family:Georgia,'Times New Roman',serif;text-transform:uppercase;letter-spacing:.12em;font-weight:400;font-size:15px;margin:17px 4px 4px}.service-grid p{font-size:12px;color:#765e50;margin:0 4px}.texture-card{position:relative;overflow:hidden}.cream-swipe{height:230px;background:radial-gradient(ellipse at 40% 45%,#fffaf6 0 15%,#ead3c2 16% 24%,#f8eee7 25% 37%,#dcc0ad 38% 47%,#f9f2ed 48% 67%,#e6cfbf 68% 74%,#fbf7f3 75%);filter:saturate(.75)}.replay{position:fixed;right:20px;bottom:20px;z-index:1200;border:1px solid rgba(91,62,45,.17);background:rgba(250,246,241,.9);backdrop-filter:blur(10px);color:#5d4233;border-radius:999px;padding:11px 15px;font-size:14px;cursor:pointer;box-shadow:0 8px 26px rgba(77,52,38,.12)}.replay span{margin-left:6px;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
        @media(max-width:980px){.nav{grid-template-columns:120px 1fr auto;padding:0 20px;height:78px}.nav-logo{width:110px}.nav-links{display:none}.book{padding:12px 15px;font-size:9px}.hero{grid-template-columns:1fr;min-height:auto}.hero-copy{padding:52px 24px 36px;max-width:none}.hero h1{font-size:50px}.lead{font-size:16px}.hero-photo-wrap{min-height:440px}.photo-veil{background:linear-gradient(180deg,#f7f0e9 0%,rgba(247,240,233,.08) 18%,transparent 40%)}.service-grid{grid-template-columns:repeat(2,1fr)}.services{padding:56px 20px 80px}.services-title{display:block}.brush-stage{height:250px}.subline{top:76%;letter-spacing:.22em}.intro-logo{top:9vh}.brush{transform:scale(.76) translate(-20%,-50%)}.replay span{display:none}}
        @media(max-width:560px){.book{display:none}.nav{grid-template-columns:1fr auto}.hero h1{font-size:42px}.service-grid{grid-template-columns:1fr}.service-grid article{min-height:280px}.service-img,.cream-swipe{height:205px}.welcome{font-size:66px}.brush-stage{height:220px}.subline{font-size:10px;top:72%}.brush{width:130px}.brush-handle{width:76px}.brush-ferrule{width:20px}.brush-bristles{width:34px}.intro-logo{width:135px;top:8vh}}
        @media(prefers-reduced-motion:reduce){.paint-line,.paint-detail,.brush,.welcome,.subline,.intro-logo{animation-duration:.01ms!important;animation-delay:0ms!important}.intro{transition-duration:.01ms}.site-preview{transition-duration:.01ms}}
      `}</style>
    </main>
  )
}
