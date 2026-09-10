'use client'

import { useEffect, useState } from 'react'

export default function WowPreviewPage() {
  const [run, setRun] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
    const t = window.setTimeout(() => setOpen(true), 2900)
    return () => window.clearTimeout(t)
  }, [run])

  return (
    <main className="wow-page">
      <div key={run} className={`intro ${open ? 'intro-off' : ''}`}>
        <div className="grain" />
        <div className="light" />
        <div className="brush-stage">
          <div className="paint paint-a" />
          <div className="paint paint-b" />
          <div className="brush">
            <span className="handle" />
            <span className="metal" />
            <span className="bristles" />
          </div>
          <div className="welcome">Welcome</div>
          <div className="tiny">GLORIA BEAUTY SALON · MIAMI</div>
        </div>
      </div>

      <div className={`site ${open ? 'site-on' : ''}`}>
        <header className="topbar">
          <img src="/images/gloria/logo/gloria-logo.png" className="logo" alt="Gloria Beauty Salon" />
          <nav>
            <a>Inicio</a><a>Servicios</a><a>Beauty DNA</a><a>Galería</a><a>Nosotros</a><a>Contacto</a>
          </nav>
          <button>Reservar cita</button>
        </header>

        <section className="hero">
          <div className="ambient ambient-a" />
          <div className="ambient ambient-b" />
          <div className="palm" />
          <div className="silk-line" />

          <div className="copy">
            <p className="eyebrow">BELLEZA · ESTILO · CONFIANZA</p>
            <h1>Belleza elevada,<br/>atención<br/>personalizada.</h1>
            <p className="lead">Una experiencia creada para realzar tu esencia con intención, detalle y belleza.</p>
            <div className="actions"><button>Reservar cita</button><a>Explorar servicios ↗</a></div>
          </div>

          <div className="portrait">
            <div className="photo-main" />
            <div className="hair-breeze hair-one" />
            <div className="hair-breeze hair-two" />
            <div className="gloss" />
            <div className="veil" />
            <div className="editorial-tag"><small>MIAMI</small><span>Beauty, your way.</span></div>
          </div>
        </section>

        <section className="editorial">
          <div className="headline"><span>NUESTROS SERVICIOS</span><h2>Beauty, curated around you.</h2></div>
          <div className="cards">
            <article className="card c1"><div/><p>01</p><h3>Cabello</h3><span>Estilo que te define</span></article>
            <article className="card c2"><div/><p>02</p><h3>Pestañas</h3><span>Mirada con intención</span></article>
            <article className="card c3"><div/><p>03</p><h3>Uñas</h3><span>Detalles que hablan de ti</span></article>
            <article className="card c4"><div/><p>04</p><h3>Beauty DNA</h3><span>Tu belleza, personalizada</span></article>
          </div>
        </section>
      </div>

      <button className="replay" onClick={() => setRun(v => v + 1)}>↻ Replay</button>

      <style jsx global>{`
        *{box-sizing:border-box}html,body{margin:0;background:#f5efe9;color:#312722}body{font-family:Arial,Helvetica,sans-serif}.wow-page{min-height:100vh;overflow-x:hidden}.intro{position:fixed;inset:0;z-index:999;background:radial-gradient(circle at 30% 28%,#fffdf9 0,#f7eee7 34%,#eadbd0 100%);display:grid;place-items:center;overflow:hidden;transition:opacity .75s ease,filter .85s ease,transform 1s cubic-bezier(.16,1,.3,1)}.intro-off{opacity:0;filter:blur(16px);transform:scale(1.035);pointer-events:none}.grain{position:absolute;inset:0;opacity:.045;background-image:radial-gradient(#604838 .6px,transparent .7px);background-size:6px 6px}.light{position:absolute;width:48vw;height:48vw;border-radius:50%;background:rgba(255,255,255,.72);filter:blur(95px);left:-18vw;top:-16vw}.brush-stage{position:relative;width:min(900px,92vw);height:330px;display:grid;place-items:center}.paint{position:absolute;left:8%;top:50%;height:92px;width:0;border-radius:46% 54% 48% 52% / 58% 44% 56% 42%;transform:translateY(-50%) rotate(-2deg);transform-origin:left center;animation:paint 1.45s .18s cubic-bezier(.2,.78,.2,1) forwards}.paint-a{background:linear-gradient(90deg,#dfc5b6,#bb8c72 46%,#d7b5a4 82%,rgba(224,201,188,.2));box-shadow:inset 0 13px 18px rgba(255,255,255,.18),inset 0 -12px 16px rgba(93,60,45,.08)}.paint-b{height:48px;top:54%;opacity:.32;filter:blur(4px);background:#fff7f1;animation-delay:.3s}.brush{position:absolute;top:49%;left:-8%;width:280px;height:72px;display:flex;align-items:center;filter:drop-shadow(0 12px 14px rgba(77,52,40,.13));animation:brush 1.62s .04s cubic-bezier(.4,.02,.22,1) forwards}.handle{width:165px;height:16px;border-radius:999px 4px 4px 999px;background:linear-gradient(90deg,#221c19,#6e5549 72%,#aa8974)}.metal{width:48px;height:35px;background:linear-gradient(90deg,#9b795f,#e9d5bc 48%,#9b795f);clip-path:polygon(0 10%,100% 0,100% 100%,0 90%)}.bristles{width:75px;height:58px;margin-left:-3px;border-radius:55% 90% 90% 55%;background:linear-gradient(90deg,#3c2b24,#9d725e 58%,#d1a995);transform:skewX(-9deg)}.welcome{position:relative;z-index:5;font-family:'Snell Roundhand','Segoe Script',cursive;font-size:clamp(70px,10vw,136px);color:#fff9f5;opacity:0;transform:translateY(10px);text-shadow:0 2px 18px rgba(73,43,31,.08);animation:word .72s 1.05s forwards}.tiny{position:absolute;top:73%;font-size:10px;letter-spacing:.38em;color:#76594a;opacity:0;animation:tiny .55s 1.68s forwards}.site{opacity:0;transform:scale(1.02);filter:blur(12px);transition:opacity 1s ease,transform 1.25s cubic-bezier(.16,1,.3,1),filter 1.1s ease}.site-on{opacity:1;transform:none;filter:none}.topbar{height:86px;display:grid;grid-template-columns:160px 1fr auto;align-items:center;padding:0 5vw;background:rgba(250,247,243,.9);backdrop-filter:blur(16px);border-bottom:1px solid rgba(70,48,36,.08);position:relative;z-index:20}.logo{width:125px;height:64px;object-fit:contain;mix-blend-mode:multiply}.topbar nav{display:flex;justify-content:center;gap:28px}.topbar nav a{font-size:12px;letter-spacing:.04em;color:#4f3b31}.topbar button,.actions button{border:0;border-radius:999px;background:#765a4c;color:#fff;padding:13px 19px;font-size:11px;letter-spacing:.11em;text-transform:uppercase}.hero{min-height:calc(100vh - 86px);display:grid;grid-template-columns:.88fr 1.12fr;position:relative;overflow:hidden;background:linear-gradient(115deg,#f8f3ee 0%,#f0e5dd 48%,#e8d7cc 100%)}.copy{align-self:center;z-index:5;padding:8vh 3vw 8vh 8vw;animation:copyIn 1s 3s both}.eyebrow{font-size:10px;letter-spacing:.28em;color:#806759;margin-bottom:24px}.copy h1{font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:clamp(55px,6.2vw,102px);line-height:.9;letter-spacing:-.058em;margin:0;color:#312722}.lead{font-family:Georgia,'Times New Roman',serif;color:#6f5b50;font-size:18px;line-height:1.65;max-width:470px;margin:28px 0 32px}.actions{display:flex;align-items:center;gap:22px}.actions a{font-size:12px;letter-spacing:.08em;border-bottom:1px solid rgba(92,68,55,.25);padding-bottom:5px}.portrait{position:relative;overflow:hidden;margin:30px 0 30px 0;border-radius:38px 0 0 38px;box-shadow:0 36px 100px rgba(74,48,35,.16);animation:portraitIn 1.35s 2.75s both cubic-bezier(.16,1,.3,1)}.photo-main,.hair-breeze{position:absolute;inset:-2%;background-image:url('/images/gloria/hero/hero-01.jpg');background-size:cover;background-position:center;animation:drift 9s ease-in-out infinite alternate}.hair-breeze{pointer-events:none;opacity:.7;mix-blend-mode:normal}.hair-one{clip-path:polygon(18% 5%,58% 7%,63% 28%,52% 48%,37% 70%,20% 64%,8% 33%);animation:hair1 4.8s ease-in-out infinite}.hair-two{clip-path:polygon(36% 17%,72% 14%,71% 53%,61% 77%,46% 92%,28% 82%,25% 44%);opacity:.34;animation:hair2 5.7s ease-in-out infinite}.gloss{position:absolute;top:-8%;left:18%;width:30%;height:120%;background:linear-gradient(105deg,transparent 0 34%,rgba(255,245,230,.04) 41%,rgba(255,245,230,.28) 50%,rgba(255,255,255,.04) 58%,transparent 67%);filter:blur(5px);mix-blend-mode:screen;animation:shine 6.8s ease-in-out infinite}.veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(245,239,233,.38),transparent 20%,transparent 72%,rgba(55,36,28,.08))}.editorial-tag{position:absolute;right:30px;bottom:28px;padding:17px 19px;width:195px;border-radius:18px;background:rgba(248,242,237,.72);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.45)}.editorial-tag small{display:block;font-size:9px;letter-spacing:.2em;color:#7a655a}.editorial-tag span{display:block;font-family:Georgia,serif;font-size:21px;margin-top:6px}.ambient{position:absolute;border-radius:50%;filter:blur(85px);opacity:.5}.ambient-a{width:330px;height:330px;background:#f4d8cd;left:-110px;top:20%}.ambient-b{width:260px;height:260px;background:#d8bcae;right:25%;bottom:-120px}.palm{position:absolute;width:380px;height:500px;left:-120px;top:-100px;opacity:.055;background:repeating-linear-gradient(68deg,transparent 0 25px,#5b463b 28px 35px,transparent 37px 58px);transform:rotate(-18deg);filter:blur(2px)}.silk-line{position:absolute;width:370px;height:150px;border-top:1px solid rgba(108,80,65,.23);border-radius:50%;left:13%;bottom:7%;transform:rotate(-7deg)}.editorial{background:#faf7f3;padding:110px 6vw 130px}.headline{display:flex;align-items:end;justify-content:space-between;border-bottom:1px solid rgba(79,55,43,.13);padding-bottom:26px;margin-bottom:38px}.headline>span{font-size:10px;letter-spacing:.28em;color:#80685a}.headline h2{font-family:Georgia,serif;font-size:clamp(42px,5vw,72px);font-weight:400;letter-spacing:-.045em;margin:0}.cards{display:grid;grid-template-columns:1.15fr .85fr 1fr 1fr;gap:16px}.card{position:relative;min-height:410px;background:#eee2da;overflow:hidden;padding:20px;display:flex;flex-direction:column;justify-content:flex-end}.card>div{position:absolute;inset:0;transition:transform .8s cubic-bezier(.16,1,.3,1)}.card:hover>div{transform:scale(1.045)}.c1>div{background:url('/images/gloria/hero/hero-01.jpg') center/cover}.c2>div{background:radial-gradient(ellipse at 52% 38%,#4f3027 0 5%,#9e6d5b 6% 11%,#e0b9a4 12% 30%,#b47f68 31% 48%,#f0d6c8 49%)}.c3>div{background:linear-gradient(135deg,#d5a892,#f6e8df 26%,#c58b72 43%,#f5e5dc 58%,#d7a18a 76%,#f7eee8)}.c4>div{background:radial-gradient(circle at 35% 28%,#fff 0 13%,transparent 26%),linear-gradient(145deg,#f5eae3,#dac0b2)}.card:after{content:'';position:absolute;inset:42% 0 0;background:linear-gradient(transparent,rgba(43,30,24,.68))}.card p,.card h3,.card span{position:relative;z-index:2;color:white}.card p{font-size:10px;letter-spacing:.2em}.card h3{font-family:Georgia,serif;font-size:32px;font-weight:400;margin:6px 0}.card span{font-size:12px;opacity:.85}.replay{position:fixed;right:18px;bottom:18px;z-index:1200;border:1px solid rgba(86,64,52,.13);background:rgba(250,246,241,.82);backdrop-filter:blur(12px);border-radius:999px;padding:10px 14px;color:#5a4337;cursor:pointer}.replay:hover{background:#fff}.intro-off+.site .portrait{}.intro-off{}.intro:after{content:'';position:absolute;inset:auto -10% -34% -10%;height:45%;background:radial-gradient(ellipse,#d5b4a2 0,transparent 70%);opacity:.15}
        @keyframes paint{0%{width:0;opacity:.1}10%{opacity:1}100%{width:84%}}@keyframes brush{0%{left:-10%;top:56%;transform:rotate(-9deg)}38%{top:43%;transform:rotate(5deg)}72%{top:52%;transform:rotate(-3deg)}100%{left:87%;top:48%;transform:rotate(4deg);opacity:.1}}@keyframes word{to{opacity:1;transform:none}}@keyframes tiny{to{opacity:1;transform:translateY(-4px)}}@keyframes copyIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}@keyframes portraitIn{from{opacity:0;transform:translateX(36px);clip-path:inset(0 0 0 100%)}to{opacity:1;transform:none;clip-path:inset(0)}}@keyframes drift{from{transform:scale(1.025) translate3d(0,0,0)}to{transform:scale(1.055) translate3d(-9px,-4px,0)}}@keyframes hair1{0%,100%{transform:scale(1.03) translate3d(0,0,0) rotate(0)}50%{transform:scale(1.045) translate3d(4px,-2px,0) rotate(.45deg)}}@keyframes hair2{0%,100%{transform:scale(1.035) translate3d(0,0,0)}50%{transform:scale(1.055) translate3d(-4px,2px,0) skewX(.5deg)}}@keyframes shine{0%,20%{transform:translateX(-115%);opacity:0}36%{opacity:.75}58%{transform:translateX(180%);opacity:.22}100%{transform:translateX(180%);opacity:0}}
        @media(max-width:980px){.topbar{height:74px;grid-template-columns:120px 1fr;padding:0 18px}.topbar nav{display:none}.topbar button{justify-self:end}.logo{width:105px}.hero{grid-template-columns:1fr;min-height:auto}.copy{padding:55px 22px 38px}.copy h1{font-size:58px}.portrait{height:58vh;min-height:500px;margin:0 16px 24px;border-radius:28px}.cards{grid-template-columns:1fr 1fr}.headline{display:block}.headline h2{margin-top:12px}.brush-stage{height:260px}.tiny{top:76%;letter-spacing:.24em}.brush{transform:scale(.78);transform-origin:left center}.welcome{font-size:72px}}@media(max-width:560px){.topbar button{display:none}.copy h1{font-size:48px}.lead{font-size:16px}.portrait{height:54vh;min-height:440px}.cards{grid-template-columns:1fr}.card{min-height:340px}.editorial{padding:80px 16px 100px}.headline h2{font-size:45px}.brush{width:190px}.handle{width:110px}.metal{width:34px}.bristles{width:50px}.tiny{font-size:8px;top:72%}.welcome{font-size:62px}.editorial-tag{right:14px;bottom:14px;width:165px}.actions{flex-wrap:wrap}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
      `}</style>
    </main>
  )
}
