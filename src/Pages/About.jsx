import React, { useEffect, useRef } from 'react'
import Layout from '../Layout/Layout'

const About = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Floating orbs / particles
    const orbs = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 120 + 40,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.3,
      hue: Math.random() > 0.6 ? 'gold' : 'green',
      opacity: Math.random() * 0.12 + 0.04,
    }))

    // Small sparkle dots
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 600,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }))

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Base gradient — rich deep green
      const bg = ctx.createLinearGradient(0, 0, w, h)
      bg.addColorStop(0, '#0f2318')
      bg.addColorStop(0.4, '#1a3a2a')
      bg.addColorStop(0.7, '#1e4530')
      bg.addColorStop(1, '#152b1e')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Soft radial gold accent top-right
      const goldGlow = ctx.createRadialGradient(w * 0.85, h * 0.1, 0, w * 0.85, h * 0.1, w * 0.45)
      goldGlow.addColorStop(0, 'rgba(224,160,48,0.18)')
      goldGlow.addColorStop(0.5, 'rgba(224,160,48,0.06)')
      goldGlow.addColorStop(1, 'rgba(224,160,48,0)')
      ctx.fillStyle = goldGlow
      ctx.fillRect(0, 0, w, h)

      // Soft teal accent bottom-left
      const tealGlow = ctx.createRadialGradient(w * 0.08, h * 0.85, 0, w * 0.08, h * 0.85, w * 0.4)
      tealGlow.addColorStop(0, 'rgba(82,183,136,0.14)')
      tealGlow.addColorStop(1, 'rgba(82,183,136,0)')
      ctx.fillStyle = tealGlow
      ctx.fillRect(0, 0, w, h)

      // Moving orbs
      orbs.forEach(orb => {
        orb.x += orb.dx
        orb.y += orb.dy
        if (orb.x < -orb.r) orb.x = w + orb.r
        if (orb.x > w + orb.r) orb.x = -orb.r
        if (orb.y < -orb.r) orb.y = h + orb.r
        if (orb.y > h + orb.r) orb.y = -orb.r

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r)
        const col = orb.hue === 'gold'
          ? `rgba(224,160,48,${orb.opacity})`
          : `rgba(82,183,136,${orb.opacity})`
        grad.addColorStop(0, col)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Subtle grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 1
      const grid = 60
      for (let x = 0; x < w; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = 0; y < h; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }

      // Diagonal accent lines
      ctx.strokeStyle = 'rgba(224,160,48,0.06)'
      ctx.lineWidth = 1
      for (let i = -h; i < w + h; i += 120) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i + h, h)
        ctx.stroke()
      }

      // Pulsing dots
      dots.forEach(d => {
        d.pulse += d.speed
        const alpha = d.opacity * (0.6 + 0.4 * Math.sin(d.pulse))
        ctx.beginPath()
        ctx.arc(d.x % w, d.y % h, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      })

      // Hexagon ring (top-right decorative)
      const hexX = w * 0.88, hexY = h * 0.25, hexR = 60
      ctx.strokeStyle = 'rgba(224,160,48,0.18)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const px = hexX + hexR * Math.cos(angle)
        const py = hexY + hexR * Math.sin(angle)
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()

      // Inner hex
      ctx.strokeStyle = 'rgba(224,160,48,0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const px = hexX + (hexR * 0.55) * Math.cos(angle)
        const py = hexY + (hexR * 0.55) * Math.sin(angle)
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()

      // Circle rings bottom-right
      const cx = w * 0.92, cy = h * 0.85
      ;[100, 65, 35].forEach((r, i) => {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(82,183,136,${0.12 - i * 0.03})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .about-page { font-family: 'DM Sans', sans-serif; background: #f5f7f4; color: #1a2a1e; }

        /* HERO */
        .about-hero {
          position: relative;
          min-height: 420px;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 80px 60px;
        }
        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        /* Noise texture overlay */
        .hero-noise {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }
        /* Bottom fade to page bg */
        .hero-fade {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: linear-gradient(to bottom, transparent, #f5f7f4);
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #f4c261;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 50px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }
        .hero-badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #e0a030;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          animation: heroFadeIn 0.9s ease both;
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(38px, 5vw, 62px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .hero-title .gold { color: #e0a030; }
        .hero-subtitle {
          font-size: 17px;
          font-weight: 300;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
          max-width: 520px;
        }

        /* STATS BAR */
        .stats-bar {
          background: #ffffff;
          padding: 36px 60px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid #e8ede9;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
        }
        .stat-item {
          text-align: center;
          padding: 0 20px;
          position: relative;
        }
        .stat-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0; top: 10%; height: 80%;
          width: 1px;
          background: #e0e8e2;
        }
        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          color: #e0a030;
          display: block;
          line-height: 1;
        }
        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #5a7060;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 6px;
          display: block;
        }

        /* MAIN */
        .about-main { padding: 80px 60px; max-width: 1200px; margin: 0 auto; }

        /* MISSION GRID */
        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 100px;
        }
        .section-tag {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #2d6a4f;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-tag::before {
          content: '';
          width: 28px; height: 2px;
          background: #e0a030;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 700;
          color: #1a2a1e;
          line-height: 1.2;
          margin-bottom: 20px;
        }
        .section-title .green { color: #2d6a4f; }
        .section-body {
          font-size: 16px;
          font-weight: 300;
          color: #5a7060;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .mission-visual {
          background: linear-gradient(145deg, #1a3a2a, #2d5a40);
          border-radius: 24px;
          padding: 50px 40px;
          position: relative;
          overflow: hidden;
          min-height: 380px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .mission-visual-bg {
          position: absolute;
          top: -20px; right: -20px;
          font-size: 160px;
          opacity: 0.08;
          transform: rotate(20deg);
        }
        .floating-pill {
          position: absolute;
          top: 30px; left: 30px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          padding: 10px 20px;
          color: #f4c261;
          font-size: 13px;
          font-weight: 500;
        }
        .mission-visual-inner { position: relative; z-index: 2; }
        .mission-quote {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.4;
          margin-bottom: 16px;
        }
        .mission-quote .gold { color: #e0a030; }
        .mission-author {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 1px;
        }

        /* FEATURES */
        .features-section { margin-bottom: 100px; }
        .features-header { text-align: center; margin-bottom: 56px; }
        .features-header .section-tag { justify-content: center; }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .feature-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 36px 30px;
          position: relative;
          overflow: hidden;
          border: 1px solid #e8ede9;
          transition: all 0.3s ease;
          cursor: default;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #2d6a4f, #e0a030);
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: left;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(45,106,79,0.12);
          border-color: transparent;
        }
        .feature-card:hover::before { transform: scaleX(1); }
        .feature-icon {
          width: 56px; height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 20px;
        }
        .icon-green { background: rgba(45,106,79,0.1); }
        .icon-gold { background: rgba(224,160,48,0.1); }
        .icon-teal { background: rgba(82,183,136,0.1); }
        .feature-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #1a2a1e;
          margin-bottom: 10px;
        }
        .feature-desc {
          font-size: 14px;
          color: #5a7060;
          line-height: 1.7;
          font-weight: 300;
        }

        /* VALUES */
        .values-section {
          background: linear-gradient(135deg, #1a3a2a 0%, #1e4530 100%);
          border-radius: 28px;
          padding: 70px 60px;
          margin-bottom: 100px;
          position: relative;
          overflow: hidden;
        }
        .values-section::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(224,160,48,0.12) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(30%, -30%);
        }
        .values-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: start;
          position: relative;
          z-index: 2;
        }
        .values-left .section-tag { color: #f4c261; }
        .values-left .section-title { color: #ffffff; }
        .values-left .section-body { color: rgba(255,255,255,0.65); }
        .values-list { list-style: none; padding: 0; }
        .value-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .value-item:last-child { border-bottom: none; }
        .value-dot {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .value-text h4 {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 4px;
          font-size: 15px;
        }
        .value-text p {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
          font-weight: 300;
          margin: 0;
        }

        /* CTA */
        .cta-section {
          text-align: center;
          padding: 60px 40px;
          background: #ffffff;
          border-radius: 28px;
          border: 1px solid #e8ede9;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 200px; height: 3px;
          background: linear-gradient(90deg, transparent, #e0a030, transparent);
        }
        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: #1a2a1e;
          margin-bottom: 14px;
        }
        .cta-title .green { color: #2d6a4f; }
        .cta-body {
          font-size: 16px;
          color: #5a7060;
          margin-bottom: 36px;
          font-weight: 300;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.7;
        }
        .btn-group { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .btn-primary {
          background: #e0a030;
          color: #ffffff;
          border: none;
          padding: 14px 36px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-primary:hover {
          background: #c8891a;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(224,160,48,0.35);
        }
        .btn-secondary {
          background: transparent;
          color: #2d6a4f;
          border: 2px solid #2d6a4f;
          padding: 14px 36px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-secondary:hover {
          background: #2d6a4f;
          color: #ffffff;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="about-page">

        {/* HERO */}
        <div className="about-hero">
          {/* Animated canvas background */}
          <canvas ref={canvasRef} className="hero-canvas" />
          {/* Noise texture */}
          <div className="hero-noise" />
          {/* Bottom fade */}
          <div className="hero-fade" />

          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              About NutriGuide
            </div>
            <h1 className="hero-title">
              Your Health Journey,<br />
              <span className="gold">Guided by Science.</span>
            </h1>
            <p className="hero-subtitle">
              NutriGuide was built with one simple belief — everyone deserves access to personalized, science-backed nutrition guidance. We're here to make that a reality.
            </p>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Diet Plans</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Food Items</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Happy Users</span>
          </div>
        </div>

        {/* MAIN */}
        <div className="about-main">

          {/* MISSION */}
          <div className="mission-grid">
            <div>
              <div className="section-tag">Our Mission</div>
              <h2 className="section-title">We Make <span className="green">Nutrition</span> Simple & Accessible</h2>
              <p className="section-body">
                In a world full of confusing diets and conflicting advice, NutriGuide cuts through the noise. We combine cutting-edge AI with trusted nutritional science to deliver plans that actually work — tailored to <em>you</em>.
              </p>
              <p className="section-body">
                Whether you're looking to lose weight, build muscle, or simply eat better, NutriGuide is your intelligent companion every step of the way.
              </p>
            </div>
            <div className="mission-visual">
              <span className="mission-visual-bg">🌿</span>
              <div className="floating-pill">🥗 AI-Powered Nutrition</div>
              <div className="mission-visual-inner">
                <div className="mission-quote">
                  "Eat Smart, Live <span className="gold">Better</span> — Every Single Day."
                </div>
                <div className="mission-author">— THE NUTRIGUIDE PROMISE</div>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="features-section">
            <div className="features-header">
              <div className="section-tag">What We Offer</div>
              <h2 className="section-title">Everything You Need to <span className="green">Thrive</span></h2>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon icon-green">🥦</div>
                <div className="feature-title">Food Nutrition Info</div>
                <p className="feature-desc">Get instant, detailed nutritional breakdowns for thousands of food items — calories, macros, vitamins, and more at your fingertips.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon icon-gold">🤖</div>
                <div className="feature-title">AI Diet Generator</div>
                <p className="feature-desc">Describe your goal — weight loss, muscle gain, diabetes management — and our AI crafts a personalized diet plan in seconds.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon icon-teal">📋</div>
                <div className="feature-title">Diet Planner</div>
                <p className="feature-desc">Plan your meals day by day, track what you eat, and save your diet history to monitor progress over time — all in one place.</p>
              </div>
            </div>
          </div>

          {/* VALUES */}
          <div className="values-section">
            <div className="values-grid">
              <div className="values-left">
                <div className="section-tag">Our Core Values</div>
                <h2 className="section-title">Built on <span style={{color:'#e0a030'}}>Trust</span> & Transparency</h2>
                <p className="section-body">We believe good health starts with honest information. Everything we do is grounded in science, empathy, and a genuine commitment to your wellbeing.</p>
              </div>
              <ul className="values-list">
                {[
                  { icon: '🔬', title: 'Science-Backed', desc: 'All recommendations are grounded in verified nutritional research and medical guidelines.' },
                  { icon: '🎯', title: 'Personalized to You', desc: 'No two bodies are alike. Our AI tailors every plan to fit your unique needs and goals.' },
                  { icon: '🔒', title: 'Privacy First', desc: 'Your health data is yours. We never sell, share, or misuse your personal information.' },
                  { icon: '🌍', title: 'Accessible for All', desc: 'Great nutrition guidance shouldn\'t be a luxury. NutriGuide is designed for everyone.' },
                ].map((v, i) => (
                  <li className="value-item" key={i}>
                    <div className="value-dot">{v.icon}</div>
                    <div className="value-text">
                      <h4>{v.title}</h4>
                      <p>{v.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-section">
            <h2 className="cta-title">Ready to Start Your <span className="green">Journey?</span></h2>
            <p className="cta-body">Join 50,000+ users who are already eating smarter and living better with NutriGuide.</p>
            <div className="btn-group">
              <button className="btn-primary">Get Started →</button>
              <button className="btn-secondary">Explore Food Info</button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default About
