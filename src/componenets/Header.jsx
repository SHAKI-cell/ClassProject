import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import aiLogo from '../assets/Ai_logo.png'
import './Header.css'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/food-info', label: 'Food Info' },
    { path: '/diet-plan', label: 'Diet Plan' },
  ]

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">

          {/* Logo */}
          <Link to="/" className="header-logo">
            <img src={logo} alt="NutriGuide Logo" className="header-logo-img" />
            <div className="header-logo-text">
              <span className="header-logo-brand">
                <span className="nutri">Nutri</span>
                <span className="guide">Guide</span>
              </span>
              <span className="header-logo-tagline">Your Health, Your Way</span>
            </div>
          </Link>

          <div className="header-separator" aria-hidden="true" />

          {/* Navigation */}
          <nav className={`header-nav${mobileOpen ? ' open' : ''}`}>
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`header-nav-link${
                  location.pathname === path ? ' active' : ''
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Login */}
            <Link to="/login" className="header-cta">
              Login
            </Link>

            {/* AI DIET LOGO BUTTON */}
            <Link to="/ai-diet" className="header-ai-btn" title="AI Diet Planner">
              <img src={aiLogo} alt="AI Diet" className="header-ai-logo-img" />
            </Link>

            {/* 👤 PROFILE BUTTON (NEW) */}
            <button
              className="header-profile-btn"
              onClick={() => navigate('/dashboard')}
              title="Your Diet Dashboard"
            >
              <svg viewBox="0 0 24 24" className="header-profile-icon">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c2-4 6-6 8-6s6 2 8 6" />
              </svg>
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            className={`header-mobile-toggle${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </header>

      <div className="header-spacer" />
    </>
  )
}

export default Header