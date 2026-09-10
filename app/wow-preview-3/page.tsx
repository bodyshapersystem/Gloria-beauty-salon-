'use client'

import { useEffect, useRef, useState } from 'react'

const services = [
  {title:'Hair', meta:'Cut · Blowdry · Color · Balayage', img:'/images/gloria/hair/hair-01.jpg'},
  {title:'Lashes', meta:'Classic · Hybrid · Mega', img:'/images/gloria/lashes/lashes-01.jpg'},
  {title:'Nails', meta:'Manicure · Pedicure · Gel', img:'/images/gloria/nails/nails-hero-red-v2.webp'},
  {title:'Brows', meta:'Shape · Wax · Definition', img:'/images/gloria/brows/brows-01.jpg'},
]

export default function WowPreviewThree(){
  const [menuOpen,setMenuOpen]=useState(false)
  const [intro,setIntro]=useState(true)
  const heroRef=useRef<HTMLElement|null>(null)

  useEffect(()=>{ const t=setTimeout(()=>setIntro(false),1750); return()=>clearTimeout(t)},[])
  useEffect(()=>{
    const el=heroRef.current; if(!el) return
    const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();el.style.setProperty('--x',String((e.clientX-r.left)/r.width-.5));el.style.setProperty('--y',String((e.clientY-r.top)/r.height-.5))}
    el.addEventListener('pointermove',move); return()=>el.removeEventListener('pointermove',move)
  },[])

  const go=(id:string)=>{setMenuOpen(false);document.querySelector(id)?.scrollIntoView({behavior:'smooth'})}

  return <main className='site'>
    <div className={`intro ${intro?'':'intro-off'}`}>
      <div className='intro-copy'><span>GLORIA</span><strong>Beauty, composed around you.</strong><i>MIAMI · CALLE 8</i></div>
      <div className='intro-slit'/><div className='intro-slit two'/>
    </div>

    <header className='nav'>
      <img src='/images/gloria/logo/gloria-logo.png' className='logo' alt='Gloria Beauty Salon'/>
      <nav className='desktop-nav'>
        <button onClick={()=>go('#services')}>Servicios</button><button onClick={()=>go('#dna')}>Beauty DNA</button><button onClick={()=>go('#experience')}>Experiencia</button><button onClick={()=>go('#book')}>Cita</button>
      </nav>
      <button className='book-top' onClick={()=>go('#book')}>RESERVAR CITA ↗</button>
      <button className='menu-btn' onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'CERRAR':'MENÚ'}</button>
    </header>

    <div className={`mobile-menu ${menuOpen?'open':''}`}>
      <button onClick={()=>go('#services')}>01 Servicios</button><button onClick={()=>go('#dna')}>02 Beauty DNA</button><button onClick={()=>go('#experience')}>03 Experiencia</button><button onClick={()=>go('#book')}>04 Reservar cita</button>
      <span>1130 SW 8th St · Miami</span>
    </div>

    <section className='hero' ref={heroRef}>
      <div className='hero-copy'>
        <p className='kicker'>GLORIA BEAUTY SALON · MIAMI</p>
        <h1><em>Beauty</em><br/>with character.</h1>
        <p className='lead'>Cabello, color, uñas, mirada y glow en una experiencia diseñada alrededor de ti.</p>
        <div className='hero-actions'><button className='primary' onClick={()=>go('#book')}>Reservar cita</button><button className='link' onClick={()=>go('#services')}>Explorar servicios →</button></div>
      </div>
      <div className='hero-photo'>
        <div className='hero-img-wrap'><img src='/images/gloria/hero/hero-01.jpg' alt='Gloria Beauty Salon'/><img src='/images/gloria/hero/hero-01.jpg' className='hair' alt=''/></div>
        <div className='shine'/><div className='frame'/><span className='vertical'>REAL WOMEN · REAL STYLE · MIAMI</span>
      </div>
      <div className='bigword'>GLORIA</div>
    </section>

    <section className='manifesto' id='experience'>
      <span>NOT JUST A SALON</span>
      <h2>Una experiencia de belleza<br/>que se siente <i>personal.</i></h2>
      <div className='manifesto-row'><p>Hair</p><p>Nails</p><p>Lashes</p><p>Brows</p><p>Spray Tan</p></div>
    </section>

    <section className='services' id='services'>
      <div className='section-title'><span>01</span><h2>Servicios</h2><p>Todo lo que necesitas, en un mismo lenguaje visual.</p></div>
      <div className='service-grid'>
        {services.map((s,i)=><article className={`svc svc-${i}`} key={s.title}>
          <img src={s.img} alt={s.title}/><div className='svc-overlay'/>
          <div className='svc-copy'><small>0{i+1}</small><h3>{s.title}</h3><p>{s.meta}</p><b>↗</b></div>
        </article>)}
      </div>
      <div className='service-cta'><span>¿Quieres ver todos los servicios y precios?</span><button>VER MENÚ COMPLETO ↗</button></div>
    </section>

    <section className='dna' id='dna'>
      <div className='dna-copy'><span>02 · BEAUTY DNA</span><h2>Your beauty,<br/><i>remembered.</i></h2><p>Tu historial, tus tonos, tus preferencias, tus estilos y tus resultados viven en un perfil visual que evoluciona contigo.</p><button>EXPLORAR BEAUTY DNA ↗</button></div>
      <div className='dna-device'>
        <div className='device-bar'><span>GLORIA ACCESS</span><span>BEAUTY DNA</span></div>
        <div className='dna-grid'>
          <div className='dna-card hero-card'><img src='/images/gloria/hair/hair-01.jpg'/><span>HAIR</span><strong>Balayage · Long · Waves</strong></div>
          <div className='dna-card'><img src='/images/gloria/nails/nails-hero-red-v2.webp'/><span>NAILS</span><strong>Almond · Red</strong></div>
          <div className='dna-card'><img src='/images/gloria/lashes/lashes-01.jpg'/><span>LASHES</span><strong>Hybrid · Soft Cat Eye</strong></div>
          <div className='dna-card'><img src='/images/gloria/brows/brows-01.jpg'/><span>BROWS</span><strong>Natural · Defined</strong></div>
        </div>
        <div className='dna-foot'><span>YOUR PROFILE IS LEARNING</span><b>84%</b></div>
      </div>
    </section>

    <section className='book' id='book'>
      <div className='book-left'><span>03 · RESERVA</span><h2>Tu próxima visita,<br/><i>en tres pasos.</i></h2><p>Elige servicio, profesional y horario. Luego recibirás confirmación y recordatorio.</p></div>
      <div className='booking-card'>
        <div className='steps'><b>1</b><span>Servicio</span><b>2</b><span>Profesional</span><b>3</b><span>Horario</span></div>
        <label>¿Qué quieres hacerte?</label>
        <div className='chips'><button>Hair</button><button>Nails</button><button>Lashes</button><button>Brows</button><button>Spray Tan</button></div>
        <label>Selecciona una experiencia</label>
        <div className='choice'><span><small>HAIR</small><strong>Blowdry · Medium</strong></span><b>$40</b></div>
        <button className='continue'>CONTINUAR →</button>
      </div>
    </section>

    <footer>
      <img src='/images/gloria/logo/gloria-logo.png' alt='Gloria Beauty Salon'/>
      <div><span>1130 SW 8th St · Miami, FL 33130</span><span>Tue—Sat · 9AM—5PM</span><span>@gloriabeautysalon_</span></div>
    </footer>

    <style jsx global>{`
      *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f2eae2;color:#281e19;font-family:Arial,Helvetica,sans-serif}.site{overflow:hidden}.intro{position:fixed;inset:0;background:#1f1714;z-index:9999;display:grid;place-items:center;transition:opacity .6s ease,visibility .6s}.intro-off{opacity:0;visibility:hidden}.intro-copy{text-align:center;color:#f2e7dc;z-index:3}.intro-copy span{display:block;font-family:Georgia,serif;font-size:clamp(58px,9vw,150px);letter-spacing:-.065em}.intro-copy strong{display:block;font-family:Georgia,serif;font-weight:400;font-style:italic;font-size:clamp(20px,2.6vw,36px);margin-top:-8px}.intro-copy i{display:block;font-style:normal;font-size:9px;letter-spacing:.4em;margin-top:28px}.intro-slit{position:absolute;left:7%;top:0;width:1px;height:100%;background:#8b6756;opacity:.35}.intro-slit.two{left:auto;right:9%}.nav{height:84px;position:sticky;top:0;z-index:100;background:rgba(247,241,235,.82);backdrop-filter:blur(18px);display:grid;grid-template-columns:170px 1fr auto;align-items:center;padding:0 4vw;border-bottom:1px solid rgba(50,33,25,.1)}.logo{width:130px;height:64px;object-fit:contain;mix-blend-mode:multiply}.desktop-nav{display:flex;justify-content:center;gap:34px}.desktop-nav button,.menu-btn{border:0;background:none;text-transform:uppercase;font-size:10px;letter-spacing:.18em;color:#49352b;cursor:pointer}.book-top,.primary,.dna-copy button,.continue,.service-cta button{border:0;border-radius:999px;background:#2b201b;color:#fff;padding:14px 22px;font-size:10px;letter-spacing:.16em;cursor:pointer}.menu-btn{display:none}.mobile-menu{display:none}.hero{--x:0;--y:0;min-height:calc(100svh - 84px);display:grid;grid-template-columns:.88fr 1.12fr;position:relative;background:radial-gradient(circle at 18% 25%,#fffaf5 0,transparent 35%),linear-gradient(120deg,#f5eee8,#ead9ce 52%,#d5bcae);overflow:hidden}.hero-copy{align-self:center;padding:70px 5vw 70px 8vw;z-index:5;transform:translate(calc(var(--x)*-8px),calc(var(--y)*-5px));transition:.15s}.kicker{font-size:9px;letter-spacing:.34em;color:#7c6254}.hero h1{font-family:Georgia,serif;font-size:clamp(64px,7vw,112px);line-height:.84;letter-spacing:-.065em;font-weight:400;margin:20px 0;color:#30221c}.hero h1 em{color:#8a6250;font-weight:400}.lead{font-family:Georgia,serif;font-size:17px;line-height:1.65;max-width:460px;color:#70584b}.hero-actions{display:flex;gap:22px;align-items:center;margin-top:30px}.link{border:0;background:none;border-bottom:1px solid #987968;padding:10px 0;text-transform:uppercase;font-size:10px;letter-spacing:.14em}.hero-photo{position:relative;overflow:hidden;border-radius:240px 0 0 240px;margin:32px 0 32px;box-shadow:0 35px 90px rgba(66,40,28,.18);transform:translate(calc(var(--x)*10px),calc(var(--y)*6px));transition:.15s}.hero-img-wrap{position:absolute;inset:-3%;animation:breath 8s ease-in-out infinite alternate}.hero-img-wrap>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.hair{clip-path:polygon(0 0,61% 0,69% 100%,0 100%);animation:hair 5.4s ease-in-out infinite alternate;transform-origin:55% 45%}.shine{position:absolute;top:-15%;left:-40%;width:35%;height:140%;background:linear-gradient(90deg,transparent,rgba(255,247,228,.28),transparent);filter:blur(6px);transform:rotate(12deg);animation:shine 7s infinite}.frame{position:absolute;inset:18px;border:1px solid rgba(255,255,255,.4);border-radius:220px 0 0 220px}.vertical{position:absolute;right:10px;top:50%;transform:rotate(90deg) translateY(-50%);font-size:8px;letter-spacing:.3em;color:#fff}.bigword{position:absolute;left:-2vw;bottom:-3vw;font-family:Georgia,serif;font-size:18vw;letter-spacing:-.08em;color:rgba(67,43,32,.045)}@keyframes breath{to{transform:scale(1.035) translate(-5px,-3px)}}@keyframes hair{to{transform:scale(1.03) translateX(-8px) rotate(-.2deg)}}@keyframes shine{0%,40%{left:-40%;opacity:0}60%{opacity:1}85%,100%{left:115%;opacity:0}}.manifesto{padding:110px 8vw;background:#261c18;color:#f3e7dc}.manifesto>span,.section-title>span,.dna-copy>span,.book-left>span{font-size:9px;letter-spacing:.34em}.manifesto h2,.section-title h2,.dna h2,.book h2{font-family:Georgia,serif;font-weight:400;letter-spacing:-.05em;line-height:.95}.manifesto h2{font-size:clamp(48px,6vw,88px);margin:18px 0 58px}.manifesto h2 i,.dna h2 i,.book h2 i{color:#bb8e76}.manifesto-row{display:flex;border-top:1px solid rgba(255,255,255,.16);padding-top:24px;justify-content:space-between;text-transform:uppercase;font-size:10px;letter-spacing:.16em}.services{padding:110px 5vw 120px;background:#f6f0ea}.section-title{display:grid;grid-template-columns:70px 1fr 350px;align-items:end;margin-bottom:45px}.section-title h2{font-size:clamp(52px,6vw,82px);margin:0}.section-title p{font-family:Georgia,serif;color:#765f53}.service-grid{display:grid;grid-template-columns:1.15fr .85fr;grid-template-rows:540px 420px;gap:18px}.svc{position:relative;overflow:hidden;background:#ddd}.svc-1{transform:translateY(50px)}.svc img{width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.16,1,.3,1)}.svc:hover img{transform:scale(1.035)}.svc-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(24,17,14,.68))}.svc-copy{position:absolute;left:24px;right:24px;bottom:22px;color:#fff;display:grid;grid-template-columns:40px 1fr auto;align-items:end}.svc-copy h3{font-family:Georgia,serif;font-size:40px;font-weight:400;letter-spacing:-.04em;margin:0}.svc-copy p{grid-column:2;font-size:11px;letter-spacing:.1em;margin:6px 0}.svc-copy b{grid-row:1/3;grid-column:3;font-size:24px}.service-cta{margin-top:70px;border-top:1px solid rgba(50,35,27,.16);padding-top:24px;display:flex;justify-content:space-between;align-items:center;font-family:Georgia,serif}.dna{padding:120px 6vw;background:linear-gradient(135deg,#dbc4b7,#b79482);display:grid;grid-template-columns:.8fr 1.2fr;gap:6vw;align-items:center}.dna h2,.book h2{font-size:clamp(52px,6vw,86px);margin:20px 0}.dna-copy p,.book-left p{font-family:Georgia,serif;font-size:17px;line-height:1.7;max-width:500px}.dna-copy button{margin-top:22px}.dna-device{background:rgba(248,243,238,.82);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.5);padding:18px;border-radius:28px;box-shadow:0 40px 100px rgba(62,37,27,.22)}.device-bar,.dna-foot{display:flex;justify-content:space-between;font-size:9px;letter-spacing:.2em;padding:9px 6px 16px}.dna-grid{display:grid;grid-template-columns:1.15fr .85fr;grid-template-rows:220px 220px;gap:10px}.dna-card{position:relative;overflow:hidden;border-radius:16px;background:#eee}.hero-card{grid-row:1/3}.dna-card img{width:100%;height:100%;object-fit:cover}.dna-card span,.dna-card strong{position:absolute;left:14px;color:white;text-shadow:0 2px 12px rgba(0,0,0,.35)}.dna-card span{bottom:40px;font-size:9px;letter-spacing:.18em}.dna-card strong{bottom:16px;font-family:Georgia,serif;font-size:15px;font-weight:400}.dna-foot{padding:16px 6px 5px}.book{padding:120px 7vw;background:#fbf7f3;display:grid;grid-template-columns:.9fr 1.1fr;gap:7vw;align-items:center}.booking-card{background:white;border:1px solid rgba(67,46,35,.12);padding:28px;border-radius:24px;box-shadow:0 30px 70px rgba(66,42,30,.1)}.steps{display:grid;grid-template-columns:28px 1fr 28px 1fr 28px 1fr;align-items:center;border-bottom:1px solid #e9dfd8;padding-bottom:18px;margin-bottom:22px}.steps b{width:24px;height:24px;border-radius:50%;background:#2d211b;color:#fff;display:grid;place-items:center;font-size:10px}.steps span{font-size:10px;text-transform:uppercase;letter-spacing:.12em}.booking-card label{display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;margin:18px 0 10px}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips button{border:1px solid #d7c7bd;background:#f8f2ed;border-radius:999px;padding:10px 14px}.choice{display:flex;justify-content:space-between;align-items:center;background:#f4ece6;padding:16px;border-radius:14px}.choice small,.choice strong{display:block}.choice small{font-size:8px;letter-spacing:.2em}.choice strong{font-family:Georgia,serif;font-weight:400;margin-top:5px}.continue{width:100%;margin-top:16px}.book footer{}.site>footer{padding:36px 5vw;background:#211814;color:#eadfd6;display:flex;justify-content:space-between;align-items:center}.site>footer img{width:120px;filter:brightness(0) invert(1);opacity:.9}.site>footer div{display:flex;gap:30px;font-size:9px;letter-spacing:.14em}.mobile-menu{position:fixed;inset:84px 0 0;background:#241a16;z-index:90;color:#f4e8df;padding:38px 24px;flex-direction:column}.mobile-menu button{background:none;border:0;color:inherit;font-family:Georgia,serif;font-size:38px;text-align:left;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.14)}.mobile-menu span{margin-top:auto;font-size:9px;letter-spacing:.18em}
      @media(max-width:900px){.nav{grid-template-columns:1fr auto auto;padding:0 18px;height:72px}.desktop-nav,.book-top{display:none}.menu-btn{display:block}.mobile-menu{display:flex;top:72px;transform:translateY(-120%);transition:.45s cubic-bezier(.16,1,.3,1)}.mobile-menu.open{transform:none}.hero{grid-template-columns:1fr;padding-top:0}.hero-copy{padding:58px 22px 34px}.hero h1{font-size:58px}.hero-photo{height:58svh;min-height:460px;margin:0;border-radius:170px 0 0 170px;margin-left:18px}.manifesto{padding:80px 22px}.manifesto-row{overflow-x:auto;gap:32px;justify-content:flex-start}.services{padding:80px 16px}.section-title{display:block}.section-title p{max-width:300px}.service-grid{grid-template-columns:1fr;grid-template-rows:none}.svc{height:430px}.svc-1{transform:none}.service-cta{align-items:flex-start;gap:18px;flex-direction:column}.dna,.book{grid-template-columns:1fr;padding:80px 18px}.dna-device{margin-top:20px}.dna-grid{grid-template-columns:1fr 1fr;grid-template-rows:230px 190px}.hero-card{grid-column:1/3;grid-row:auto}.site>footer{align-items:flex-start;gap:30px;flex-direction:column}.site>footer div{flex-direction:column;gap:10px}.logo{width:105px}.steps{grid-template-columns:24px 1fr 24px 1fr 24px 1fr}.steps span{font-size:8px}.intro-copy span{font-size:72px}}
    `}</style>
  </main>
}
